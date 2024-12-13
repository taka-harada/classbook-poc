import { style, styleVariants } from "@vanilla-extract/css";

export const modalContainer = style({
  position: "fixed",
  top: "20%",
  left: "20%",
  background: "#fff",
  border: "1px solid #ccc",
  padding: "16px",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
})

export const imageContainer = style({
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
})

export const imageItem = style({
  width: "100px",
  height: "100px",
  objectFit: "cover",
  cursor: "pointer",
  border: "2px solid transparent"
})

export const pageContainer = style({
  minWidth: "1400px",
  minHeight: "800px"
})

export const pageBackgroundVariants = styleVariants({
  image1: {
    backgroundImage: 'url(/images/theme/image1.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  image2: {
    backgroundImage: 'url(/images/theme/image2.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  image3: {
    backgroundImage: 'url(/images/theme/image3.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  image4: {
    backgroundImage: 'url(/images/theme/image4.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
})

export const frameListWrap = style({
  display: 'flex',
  justifyContent: 'space-around',
  flexWrap: 'wrap',
})

export const frameContainer = style({
  // width: '200px',
  // lineHeight: '150px',
  // margin: '50px',
})

export const isSelectedFrame = style({
  border: '2px solid green'
})

export const frameImageArea = style({
  border: '2px solid black',
  width: '200px',
  height: '200px',
  position: 'relative',
  margin: '10px',
  overflow: 'hidden',
  backgroundColor: '#eee'
})

export const dragOver = style({
  opacity: '0.5',
  border: '2px solid #00f'
})

export const frameImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover'
})

export const fileInput = style({
  // position: 'absolute',
  // bottom: '10px',
  // left: '50%',
  // transform: 'translateX(-50%'
})
