import { FC, useState } from "react"
import AlbumPage from "../AlbumPage/AlbumPage"
import { modalContainer, imageContainer, imageItem } from "../../../styles.css"

type FrameDataType = {
  id: number
  image: string | null
  framePosition: { x: number, y: number } // フレーム自体を自由に移動可能にする場合、座標も必要
  frameSize: { width: number, height: number }
}

type PageDataType = {
  id: number
  pageSize: { width: number, height: number }
  backgroundImage: string | null
  frames: FrameDataType[]
}

// 各ページのサイズは個別に持たせるかアルバムデータの中に1つ持たせるか？
export const Container: FC = () => {
  const defaultAlbumData = [
    {
      id: 1,
      pageSize: { width: 0, height: 0},
      backgroundImage: null,
      frames: [
        { id: 1, image: null, framePosition: {x: 0, y: 0}, frameSize: {width: 0, height: 0} },
        { id: 2, image: null, framePosition: {x: 0, y: 0}, frameSize: {width: 0, height: 0} },
        { id: 3, image: null, framePosition: {x: 0, y: 0}, frameSize: {width: 0, height: 0} },
      ]
    },
    {
      id: 2,
      pageSize: { width: 0, height: 0},
      backgroundImage: null,
      frames: [
        { id: 4, image: null, framePosition: {x: 0, y: 0}, frameSize: {width: 0, height: 0} },
        { id: 5, image: null, framePosition: {x: 0, y: 0}, frameSize: {width: 0, height: 0} },
        { id: 6, image: null, framePosition: {x: 0, y: 0}, frameSize: {width: 0, height: 0} },
      ]
    },
    {
      id: 3,
      pageSize: { width: 0, height: 0},
      backgroundImage: null,
      frames: [
        { id: 7, image: null, framePosition: {x: 0, y: 0}, frameSize: {width: 0, height: 0} },
        { id: 8, image: null, framePosition: {x: 0, y: 0}, frameSize: {width: 0, height: 0} },
        { id: 9, image: null, framePosition: {x: 0, y: 0}, frameSize: {width: 0, height: 0} },
      ]
    },
  ]

  // MEMO: APIから取得予定
  const backgroundImageList = [
    { id: 1, name: 'はらっぱあそび', imageSrc: "/images/theme/image1.jpg" },
    { id: 2, name: '園庭あそび', imageSrc: "/images/theme/image2.jpg" },
    { id: 3, name: 'くもとそら', imageSrc: "/images/theme/image3.jpg" },
    { id: 4, name: '運動会', imageSrc: "/images/theme/image4.jpg" }
  ]

  // MEMO: APIから取得予定
  const imageList = [
    "/images/image1.jpg",
    "/images/image2.jpg",
    "/images/image3.jpg",
    "/images/image4.jpg",
  ]

  // アルバム全体を一元管理
  const [pages, setPages] = useState<PageDataType[]>(defaultAlbumData)

  // 現在選択されているページを管理
  const [currentPageId, setCurrentPageId] = useState<number>(1)
  // 選択されているフレームを管理
  const [selectedFrame, setSelectedFrame] = useState<{ pageId: number, frameId: number } | null>(null)
  // 選択された画像が編集可能かどうかを管理
  const [isEditable, setIsEditable] = useState<boolean>(false)
  // 選択された画像の編集状態を管理
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  // ページサイズを更新
  const handlePageSize = (pageId: number, pageSize: { width: number, height: number }) => {
    console.log("handlePageSizeがコール", pageSize)
    setPages(prevPages =>
      prevPages.map(page =>
        page.id === pageId
          ? { ...page, pageSize: pageSize }
          : page
      )
    )
  }

  const handlePageBackgroundImage = (pageId: number, backgroundImage: string) => {
    setPages(prevPage =>
      prevPage.map(page =>
        page.id === pageId
          ? { ...page, backgroundImage }
          : page
      )
    )
  }

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

  const handleSelectPage = (pageId: number) => setCurrentPageId(pageId)

  // フレーム選択時の処理（MEMO: 将来的にテキストも選択状態にしたりしそうなのでhandleSelectElementなどになりそう）
  const handleSelectFrame = (pageId: number, frameId: number, imageSrc?: string) => {

    // 選択されたフレームのページidとフレームidをセット
    setSelectedFrame({ pageId, frameId })

    // MEMO: ここで画像がセットされていたら「画像を編集状態」にするフラグを制御
    console.log("image返ってきてる？",imageSrc) //Frameがクリックされないと発火しないのでNG。クリックせずとも画像がセットされてたら「編集」ボタン出すべき

    // 画像がセットされていたら「編集可能」状態に（ボタンが表示）
    setIsEditable( imageSrc ? true : false)
  }

  // 画像選択時の処理
  const handleSelectImage = (imageSrc: string) => {
    // フレーム選択時の場合
    if(selectedFrame) {
      const { pageId, frameId } = selectedFrame
      handleFrameImage(pageId, frameId, imageSrc)
      setSelectedFrame(null)
    }
  }

  const handleEditMode = () => {
    setIsEditMode(true)
  }

  // console.log("pagesデータ",pages)
  // console.log("imageListどうなってる？",imageList)

  const onClickCancel = () => {
    setSelectedFrame(null) //フレーム選択状態を解除
    setIsEditMode(false) //編集モード終了
  }

  return (
    <div>
      <h1>アルバム編集</h1>
      {/* ページ切り替えタブ */}
      <div>
        {pages.map(page => (
          <button
            key={page.id}
            onClick={() => handleSelectPage(page.id)}
          >ページ {page.id}</button>
        ))}
      </div>
      {/* 選択したページを表示 */}
      <div>
        {pages.filter(page => page.id === currentPageId).map(page => (
          <AlbumPage
            key={page.id}
            pageId={page.id}
            backgroundImageList={backgroundImageList}
            selectedBackgroundImage={page.backgroundImage}
            frames={page.frames}
            selectedFrame={selectedFrame}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            handlePageSize={handlePageSize}
            handlePageBackgroundImage={handlePageBackgroundImage}
            handleFrameImage={handleFrameImage}
            handleFrameData={handleFrameData}
            handleSelectFrame={handleSelectFrame}
          />
        ))}
      </div>

      {/* 編集ボタン */}
      {isEditable && (
        <div>
          <button onClick={handleEditMode}>画像を編集</button>
          <button onClick={() => console.log("解除")}>選択解除</button>
        </div>
      )}

      {/* 画像選択モーダル */}
      {selectedFrame && (
        <div className={modalContainer}>
          <h2>画像を選択してください</h2>
          <div className={imageContainer}>
            {imageList.map((imageSrc, index) => (
              <img className={imageItem} key={index} src={imageSrc} alt={`Image ${index}`} onClick={() => handleSelectImage(imageSrc)} />
            ))}
          </div>
          <button onClick={onClickCancel}>キャンセル</button>
        </div>
      )}
    </div>
  )
}
