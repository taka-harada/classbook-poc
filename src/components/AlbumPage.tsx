import AlbumFrame from "./AlbumFrame"

type FrameDataType = {
  id: number
  image: string | null
  framePosition: { x: number, y: number } // フレーム自体を自由に移動可能にする場合、座標も必要
  frameSize: { width: number, height: number }
}

type AlbumPageProps = {
  pageId: number
  frames: FrameDataType[]
  handleFrameImage: (pageId: number, frameId: number, imageSrc: string) => void
  handleFrameData: (pageId: number, frameId: number, frameData: {x: number, y: number, width: number, height: number}) => void
}

const AlbumPage = ({ pageId, frames, handleFrameImage, handleFrameData }: AlbumPageProps) => {

  return (
    <div>
      <h2>ページ {pageId}</h2>
      <div>
        {frames.map(frame => (
          <AlbumFrame
            key={frame.id}
            pageId={pageId}
            frameId={frame.id}
            image={frame.image}
            handleFrameImage={handleFrameImage}
            handleFrameData={handleFrameData}
          />
        ))}
      </div>
    </div>
  )
}

export default AlbumPage
