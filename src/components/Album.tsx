import { useState } from "react"
import AlbumPage from "./albumPage"

type FrameDataType = {
  id: number
  image: string | null
  framePosition: { x: number, y: number } // フレーム自体を自由に移動可能にする場合、座標も必要
  frameSize: { width: number, height: number }
}

type PageDataType = {
  id: number
  frames: FrameDataType[]
}

const Album = () => {
  const defaultAlbumData = [
    {
      id: 1,
      frames: [
        { id: 1, image: null, framePosition: {x: 0, y: 0}, frameSize: {width: 0, height: 0} },
        { id: 2, image: null, framePosition: {x: 0, y: 0}, frameSize: {width: 0, height: 0} },
        { id: 3, image: null, framePosition: {x: 0, y: 0}, frameSize: {width: 0, height: 0} },
      ]
    },
    {
      id: 2,
      frames: [
        { id: 4, image: null, framePosition: {x: 0, y: 0}, frameSize: {width: 0, height: 0} },
        { id: 5, image: null, framePosition: {x: 0, y: 0}, frameSize: {width: 0, height: 0} },
        { id: 6, image: null, framePosition: {x: 0, y: 0}, frameSize: {width: 0, height: 0} },
      ]
    },
    {
      id: 3,
      frames: [
        { id: 7, image: null, framePosition: {x: 0, y: 0}, frameSize: {width: 0, height: 0} },
        { id: 8, image: null, framePosition: {x: 0, y: 0}, frameSize: {width: 0, height: 0} },
        { id: 9, image: null, framePosition: {x: 0, y: 0}, frameSize: {width: 0, height: 0} },
      ]
    },
  ]

  // アルバム全体を一元管理
  const [pages, setPages] = useState<PageDataType[]>(defaultAlbumData)

  // アルバムデータを更新
  // const savePageData = (pageId: number, updatedFrames: FrameDataType[]) => {
  //   setPages(prevPages =>
  //     prevPages.map(page =>
  //       page.id === pageId ? { ...page, frames: updatedFrames } : page
  //     )
  //   )
  // }

  // フレーム画像を更新
  const handleFrameImage = (pageId: number, frameId: number, imageSrc: string) => {
    setPages(prevPages =>
      prevPages.map(page =>
        page.id === pageId
          ? {
            ...page,
            frames: page.frames.map(frame =>
              frame.id === frameId ? { ...frame, image: imageSrc } : frame
            )
          }
          : page
      )
    )
  }

  // フレームの座標/サイズを更新
  const handleFrameData = (pageId: number, frameId: number, frameData: {x:number, y:number, width:number, height: number}) => {
    setPages(prevPages =>
      prevPages.map(page =>
        page.id === pageId
        ? {
          ...page,
          frames: page.frames.map(frame =>
            frame.id === frameId
              ? {
                  ...frame,
                  framePosition: {x: frameData.x, y: frameData.y},
                  frameSize: {width: frameData.width, height: frameData.height}
                }
              : frame
          )
        }
        : page
      )
    )
  }


  return (
    <div>
      <h1>アルバム編集</h1>
      <div>
        {pages.map(page => (
          <AlbumPage
            key={page.id}
            pageId={page.id}
            frames={page.frames}
            handleFrameImage={handleFrameImage}
            handleFrameData={handleFrameData}
          />
        ))}
      </div>
    </div>
  )
}

export default Album
