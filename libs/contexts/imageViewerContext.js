import React, { useState, useContext } from 'react'

const ImageViewerContext = React.createContext({
  image: {},
  setImage: () => {},
})

const ImageViewerProvider = ({ children }) => {
  const [image, setImage] = useState({})

  return (
    <ImageViewerContext.Provider value={{ image, setImage }}>
      {children}
    </ImageViewerContext.Provider>
  )
}

const useImageViewerContext = () => useContext(ImageViewerContext)

export { ImageViewerProvider, useImageViewerContext }