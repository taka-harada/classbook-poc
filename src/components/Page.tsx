import { useState } from "react";
// import { ResizableBox } from "react-resizable"
import Frame from "./Frame.tsx";
import { pageContainer } from "../styles.css.ts";

type FrameDataType = {
  id: number
  image: string | null
  framePosition: { x: number, y: number } // フレーム自体を自由に移動可能にする場合、座標も必要
  frameSize: { width: number, height: number }
}
// type PageProps = {
//   frames: FrameDataType[]
//   updateFrames: (updatedFrames: FrameDataType[]) => void
// }

const Page = () => {

  // const handleFrameData = ( frameId: number, frameData: { x: number, y: number, width: number, height: number } ) => {
  //   const updatedFrames = frames.map(frame =>
  //     frame.id === frameId
  //       ? {
  //         ...frame,
  //         framePosition: { x: frameData.x, y: frameData.y },
  //         frameSize: { width: frameData.width, height: frameData.height }
  //       }
  //       : frame
  //   )
  //   updateFrames(updatedFrames)
  // }

  // const handleFrameImage = (frameId: number, imageSrc: string) => {
  //   const updatedFrames = frames.map(frame =>
  //     frame.id === frameId ? { ...frame, image: imageSrc } : frame
  //   )
  //   updateFrames(updatedFrames)
  // }

  // MEMO: imageはBase64で大丈夫か確認。imageをどこかにアップロードする場合は、
  const defaultFrameData = [
    { id: 1, image: null, framePosition: {x: 0, y: 0}, frameSize: {width: 0, height: 0} },
    { id: 2, image: null, framePosition: {x: 0, y: 0}, frameSize: {width: 0, height: 0} },
    { id: 3, image: null, framePosition: {x: 0, y: 0}, frameSize: {width: 0, height: 0} },
  ]
  const [frames, setFrames] = useState<FrameDataType[]>(defaultFrameData)

  // 各フレームの画像を一元管理
  const handleFrameImage = ( frameId: number, imageSrc: string ) => {
    setFrames(prevFrames =>
      prevFrames.map(frame =>
        frame.id === frameId ? { ...frame, image: imageSrc } : frame))
  }

  // 各フレームの座標/サイズを一元管理
  const handleFrameData = ( frameId: number, frameData: { x: number, y: number, width: number, height: number }) => {
    setFrames(prevFrames =>
      prevFrames.map(frame =>
        frame.id === frameId ? { ...frame, framePosition: {x: frameData.x, y: frameData.y }, frameSize: {width: frameData.width, height: frameData.height} } : frame
      )
    )
  }

  //ページデータを出力
  // const exportAlbumData = () => {
  //   console.log("アルバムデータ:", frames)
  // }

  // パターン1:フロント側でPDFデータを生成する場合
  // jsPDFやhtml2pdfなどでDOMをキャプチャしてPDFとして出力する
  // const pageContentRef = useRef<HTMLDivElement>(null)
  const exportPdf = () => {
    console.log("フロント側でPDF生成")
    // if(pageContentRef.current) {
    //   const options = {
    //     margin: 1,
    //     filename: 'page.pdf',
    //     image: { type: 'jpeg', scale: 2 },
    //     jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    //   }
    //   html2pdf().from(pageContentRef.current).set(options).save()
    // }
  }

  // パターン2:バックエンドでPDFを生成する場合
  // Puppeteer, PDFKit, jsPDFなどを利用。画像はクライアントサイドでどこかにアップロードしてURLを送った方がよさげ？
  const postPageData = async () => {
    console.log("JSONにするデータ",frames)
    // フレームデータをバックエンドに送信
    try {
      const res = await fetch("/api/generatePdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(frames)
      })

      if(res.status === 200) {
        console.log("PDF生成に成功しました")
      } else {
        alert("PDF生成に失敗しました")
      }
    } catch(e) {
      console.error("APIエラーが発生しました", e)
    }
  }

  return (
    <div>
      <div className={pageContainer}>
        {frames.map(frame => (
          <Frame key={frame.id} id={frame.id} image={frame.image} handleFrameImage={handleFrameImage} handleFrameData={handleFrameData}></Frame>
        ))}
      </div>
      <button onClick={postPageData}>製本データを作成（バックエンドでPDF生成）</button>
      <button onClick={exportPdf}>製本データを作成（フロントエンドでPDF生成）</button>
    </div>
  )
}

export default Page
