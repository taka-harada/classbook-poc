import { ChangeEvent, DragEvent, useEffect, useState, useRef, useCallback } from "react"
import Moveable from "react-moveable"
import { frameContainer, frameImageArea, dragOver, frameImage, fileInput } from "../styles.css.ts"

type FrameType = {
  pageId: number
  frameId: number
  image: string | null
  handleFrameImage: (pageId: number, frameId: number, image: string) => void
  handleFrameData: (pageId: number, frameId: number, frameData: {x: number, y: number, width: number, height: number}) => void
  handleSelectFrame: (pageId: number, frameId: number) => void
}

const AlbumFrame = ({ pageId, frameId, image, handleFrameImage, handleFrameData, handleSelectFrame }: FrameType) => {

  // DragOverを管理
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const frameRef = useRef<HTMLDivElement | null>(null)
  const [moveableTarget, setMoveableTarget] = useState<HTMLDivElement | null>(null)


  // 前回の座標を管理するref
  const prevFrameData = useRef<{x: number, y: number, width: number, height: number} | null>(null)

  // コンポーネントがマウントされたときにMoveableのターゲットを更新
  useEffect(() => {
    setMoveableTarget(frameRef.current)
  }, [frameRef.current])

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
        handleFrameData(pageId, frameId, currentFrameData) //親に座標を渡す
        prevFrameData.current = currentFrameData
      }
    }
  }, [pageId, frameId, handleFrameData])

  // ファイル選択のinputを使った場合
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files  = e.target.files
    if(files && files[0]) {
      const file = files[0]

      // Base64の場合はFileReaderのresultをFrameのデータセットにつめる
      // MEMO: この辺の処理はのちに共通化
      const reader = new FileReader()
      reader.onloadend = () => {
        handleFrameImage(pageId, frameId, reader.result as string)
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
          handleFrameImage(pageId, frameId, reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    },
    [pageId, frameId, handleFrameImage]
  )

  // フレームがクリックされたとき
  const handleClickFrame = () => handleSelectFrame(pageId, frameId)

  return (
    <div ref={frameRef} className={frameContainer} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={handleClickFrame}>
      <div className={`${frameImageArea} ${isDragOver ? dragOver : ""}`}>
        {image ? (
          <img className={frameImage} src={image} alt={`frame-${frameId}`} />
        ) : (
          <p>画像を選択</p>
        )}
      </div>
      <input className={fileInput} type="file" accept='image/*' onChange={handleFileChange} />

      <Moveable
        target={moveableTarget}
        draggable={true}
        resizable={true}
        origin={false}
        throttleDrag={0}
        throttleResize={0}
        keepRatio={true}
        onDrag={(e) => {e.target.style.transform = e.transform}}
        onResize={e => {
          e.target.style.width = `${e.width}px`
          e.target.style.height = `${e.height}px`
        }}
        // rotatable={true}
        // onDrag={handleMove}
        // onRotate={handleRotate}
      />
    </div>
  )
}

export default AlbumFrame
