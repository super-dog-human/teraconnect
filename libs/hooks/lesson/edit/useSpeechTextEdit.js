import { useState } from 'react'

export default function useSpeechTextEdit() {
  function changeBodyColor(color) {
    console.log(color)
  }

  function changeBorderColor(color) {
    console.log(color)
  }

  function changeHorizontalAlign(align) {
    console.log(align)
  }

  function changeVerticalAlign(align) {
    console.log(align)
  }

  return { changeBodyColor, changeBorderColor, changeHorizontalAlign, changeVerticalAlign }
}

/*
SizeVW          uint8  `json:"sizeVW"`
	Body            string `json:"body"`
	BodyColor       string `json:"bodyColor"`
	BorderColor     string `json:"borderColor"`
	HorizontalAlign string `json:"horizontalAlign"`
	VerticalAlign   string `json:"verticalAlign"`
*/