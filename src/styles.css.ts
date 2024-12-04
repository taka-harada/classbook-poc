import { style } from "@vanilla-extract/css";

export const pageContainer = style({
  display: 'flex',
  justifyContent: 'space-around',
  flexWrap: 'wrap'
})

export const frameContainer = style({
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
