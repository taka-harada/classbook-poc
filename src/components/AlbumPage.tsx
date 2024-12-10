import { useEffect, useRef } from 'react'
import AlbumFrame from "./AlbumFrame"
import { pageContainer, frameListWrap } from "../styles.css"

type FrameDataType = {
  id: number
  image: string | null
  framePosition: { x: number, y: number } // フレーム自体を自由に移動可能にする場合、座標も必要
  frameSize: { width: number, height: number }
}

type BackgroundImageType = {
  id: number
  name: string
  imageSrc: string
}

type AlbumPageProps = {
  pageId: number
  backgroundImageList: BackgroundImageType[]
  selectedBackgroundImage: string | null
  frames: FrameDataType[]
  handlePageSize: (pageId: number, pageSize: { width: number, height: number }) => void
  handlePageBackgroundImage: (pageId: number, imageSrc: string) => void
  handleFrameImage: (pageId: number, frameId: number, imageSrc: string) => void
  handleFrameData: (pageId: number, frameId: number, frameData: {x: number, y: number, width: number, height: number}) => void
  handleSelectFrame: (pageId: number, frameId: number) => void
}

const AlbumPage = ({
  pageId,
  backgroundImageList,
  selectedBackgroundImage,
  frames,
  handlePageSize,
  handlePageBackgroundImage,
  handleFrameImage,
  handleFrameData,
  handleSelectFrame
}: AlbumPageProps) => {

  const pageContainerRef = useRef<HTMLDivElement | null>(null)

  const themeStyle = {
    backgroundImage: `url(${selectedBackgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center"
  }

  useEffect(() => {
    console.log("AlbumPageのuseEffect",pageContainerRef.current)
    if(pageContainerRef.current) {
      const { offsetWidth, offsetHeight } = pageContainerRef.current
      handlePageSize(pageId, { width: offsetWidth, height: offsetHeight })
    }
  }, [pageId])

  return (
    <div>
      <h2>ページ {pageId}</h2>
      <label htmlFor="background-select">背景画像:</label>
      <select id="background-select" value={selectedBackgroundImage || ''} onChange={(e) => handlePageBackgroundImage(pageId, e.target.value)}>
        {backgroundImageList.map((image, index) => (
          <option key={index} value={image.imageSrc}>{`画像 ${image.name}`}</option>
        ))}
      </select>

      <div ref={pageContainerRef} className={pageContainer} style={themeStyle}>
        <div className={frameListWrap}>
          {frames.map(frame => (
            <AlbumFrame
              key={frame.id}
              pageId={pageId}
              frameId={frame.id}
              image={frame.image}
              handleFrameImage={handleFrameImage}
              handleFrameData={handleFrameData}
              handleSelectFrame={handleSelectFrame}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AlbumPage
