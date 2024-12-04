import { ChangeEvent, DragEvent, useEffect, useState, useRef, useCallback } from "react"
import { frameContainer, frameImageArea, dragOver, frameImage, fileInput } from "../styles.css.ts"

type FrameType = {
  id: number
  image: string | null
  // framePosition: { x: number, y: number }
  // frameSize: { width: number, height: number }
  handleFrameImage: (id: number, image: string) => void
  handleFrameData: (id: number, frameData: {x: number, y: number, width: number, height: number}) => void
}

const Frame = ({ id, image, handleFrameImage, handleFrameData }: FrameType) => {

  // DragOverを管理
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const frameRef = useRef<HTMLDivElement | null>(null)

  // 前回の座標を管理するref
  const prevFrameData = useRef<{x: number, y: number, width: number, height: number} | null>(null)

  // コンポーネントがマウントされたときに座標を更新
  useEffect(() => {
    if(frameRef.current) {
      const rect = frameRef.current.getBoundingClientRect()
      const currentFrameData = { x: rect.x, y: rect.y, width: rect.width, height: rect.height }

      // 前回の座標と比較し異なる場合は更新
      if(
        !prevFrameData.current ||
        prevFrameData.current.x !== currentFrameData.x ||
        prevFrameData.current.y !== currentFrameData.y ||
        prevFrameData.current.width !== currentFrameData.width ||
        prevFrameData.current.height !== currentFrameData.height
      ) {
        handleFrameData(id, currentFrameData) //親に座標を渡す
        prevFrameData.current = currentFrameData
      }
    }
  }, [id, handleFrameData])

  // MEMO: URLをFrameのデータセットに持たせる場合どこかにアップロード
  // const uploadImage = async (file: File) => {
  //   const formData = new FormData()
  //   formData.append("image", file)

  //   try {
  //     const res = await fetch("http://xxxxx/upload", {
  //       method: "POST",
  //       body: formData
  //     })
  //     const data = res.json()
  //     console.log(data)
  //     // APIレスポンスから取り出したURLをhandleFrameImageにつめて更新
  //   } catch (e) {
  //     console.error("Error Upload Image", e)
  //   }
  // }

  // ファイル選択のinputを使った場合
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files  = e.target.files
    if(files && files[0]) {
      const file = files[0]

      // Base64の場合はFileReaderのresultをFrameのデータセットにつめる
      // MEMO: この辺の処理はのちに共通化
      const reader = new FileReader()
      reader.onloadend = () => {
        handleFrameImage(id, reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // ondragoverイベント
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true) // ドラッグ中にセット
  }

  // ondragleaveイベント
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  // Dropイベント
  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      // ドロップのデフォルト処理を防ぐ
      e.preventDefault()
      setIsDragOver(false) //ドロップ後にリセット

      const files = e.dataTransfer.files
      if (files && files[0]) {
        const file = files[0]
        const reader = new FileReader()
        reader.onloadend = () => {
          handleFrameImage(id, reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    },
    [id, handleFrameImage]
  )

  return (
    <div ref={frameRef} className={frameContainer} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      <div className={`${frameImageArea} ${isDragOver ? dragOver : ""}`}>
        {image ? (
          <img className={frameImage} src={image} alt={`frame-${id}`} />
        ) : (
          <p>画像を選択</p>
        )}
      </div>
      <input className={fileInput} type="file" accept='image/*' onChange={handleFileChange} />
    </div>
  )
}

export default Frame
