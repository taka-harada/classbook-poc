import { ChangeEvent, DragEvent, useEffect, useState, useRef, useCallback, Dispatch, SetStateAction } from "react"
import Moveable from "react-moveable"
import { frameContainer, isSelectedFrame, frameImageArea, dragOver, frameImage, fileInput } from "../../../styles.css.ts"

type FrameType = {
  pageId: number
  frameId: number
  imageSrc: string | null
  selectedFrame: {pageId: number, frameId: number} | null
  isEditMode: boolean
  setIsEditMode: Dispatch<SetStateAction<boolean>>
  handleFrameImage: (pageId: number, frameId: number, imageSrc: string) => void
  handleFrameData: (pageId: number, frameId: number, frameData: {x: number, y: number, width: number, height: number}) => void
  handleSelectFrame: (pageId: number, frameId: number, image?: string) => void
}

const AlbumFrame = ({ pageId, frameId, imageSrc, selectedFrame, isEditMode, setIsEditMode, handleFrameImage, handleFrameData, handleSelectFrame }: FrameType) => {

  // 複数フレームの中から現在選択中のフレームを特定
  const isActive = selectedFrame?.pageId === pageId && selectedFrame?.frameId === frameId

  // DragOverを管理
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const frameRef = useRef<HTMLDivElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const [moveableTarget, setMoveableTarget] = useState<HTMLImageElement | null>(null)

  // 前回の座標を管理するref
  const prevFrameData = useRef<{x: number, y: number, width: number, height: number} | null>(null)

  // コンポーネントがマウントされたときにMoveableのターゲットを更新
  useEffect(() => {

    // 画像が存在する場合にMoveableターゲットを設定（ここは画像がセットされる & 選択状態になった時にした方がよさげ）
    if(isEditMode && isActive && imageRef.current) {
      setMoveableTarget(imageRef.current)
    } else {
      setMoveableTarget(null)
    }
  }, [isEditMode, isActive])

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
  const handleClickFrame = () => {
    handleSelectFrame(pageId, frameId, imageSrc || undefined) //nullの場合はundefinedを渡す
    setIsEditMode(false) //編集モード終了
  }

  return (
    <>
    <div ref={frameRef} className={`${frameContainer} ${isActive ? isSelectedFrame : ""}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={handleClickFrame}>
      <div className={`${frameImageArea} ${isDragOver ? dragOver : ""}`}>
        {imageSrc ? (
          <img ref={imageRef} className={frameImage} src={imageSrc} alt={`frame-${frameId}`} />
        ) : (
          <p>画像を選択</p>
        )}
      </div>
      <input className={fileInput} type="file" accept='image/*' onChange={handleFileChange} />

      {isActive && isEditMode && moveableTarget && (
        <Moveable
          target={moveableTarget}
          resizable={true}
          origin={false}
          throttleResize={0}
          keepRatio={true}
          onResize={e => {
            if(imageRef.current) {
              imageRef.current.style.width = `${e.width}px`
              imageRef.current.style.height = `${e.height}px`
            }
          }}
        />
      )}
    </div>
  </>
  )
}

export default AlbumFrame
