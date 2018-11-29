import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Dropzone from 'react-dropzone'
import { fetchGraphics, uploadGraphics } from '../shared/utils/networkManager'
import styled from '@emotion/styled'
import { css } from 'emotion'

const failedDownloadingGraphics = '画像の読み込みに失敗しました'
const failedUploadingGraphics = '画像のアップロードに失敗しました'

export default class GraphicManager extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            graphics: [],
            selectedGraphicIDs: []
        }
    }

    componentWillMount() {
        fetchGraphics()
            .then(graphics => {
                this.setState({ graphics: graphics })
            })
            .catch(err => {
                this.props.openModal({
                    title: failedDownloadingGraphics,
                    message: err.message,
                    onClose: () => {
                        this.props.closeModal()
                        location.reload()
                    }
                })
            })
    }

    async handleGraphicChange(event) {
        let graphicIDs = this.state.selectedGraphicIDs

        const changedID = event.target.value
        if (event.target.checked) {
            graphicIDs.push(changedID)
        } else {
            graphicIDs = graphicIDs.filter(id => {
                return id != changedID
            })
        }

        await this.setState({ selectedGraphicIDs: graphicIDs })

        this.props.onGraphicsChange(this.state.selectedGraphicIDs)
    }

    async handleDrop(acceptedFiles) {
        if (this.props.isCreating) return
        if (acceptedFiles.lenth === 0) return

        this.props.onStatusChange(true)

        await uploadGraphics(acceptedFiles)
            .then(newGraphics => {
                const graphics = this.state.graphics.concat(newGraphics)
                this.setState({ graphics: graphics })

                this.props.onStatusChange(false)
            })
            .catch(err => {
                this.props.openModal({
                    title: failedUploadingGraphics,
                    message: err.message,
                    onClose: this.props.closeModal
                })
            })
    }

    render() {
        return (
            <GraphicManagerContainer className="app-back-color-dark-gray">
                <GraphicScrollList>
                    {this.state.graphics.map((graphic, i) => {
                        const isSelected = this.state.selectedGraphicIDs.includes(
                            graphic.id
                        )
                        return (
                            <GraphicLabel
                                key={i}
                                className={
                                    isSelected
                                        ? selectedElementStyle
                                        : unselectElementStyle
                                }
                            >
                                <GraphicThumbnail src={graphic.thumbnailURL} />
                                <GraphicSelector
                                    type="checkbox"
                                    value={graphic.id}
                                    checked={isSelected}
                                    onChange={this.handleGraphicChange.bind(
                                        this
                                    )}
                                />
                            </GraphicLabel>
                        )
                    })}
                </GraphicScrollList>
                <GraphicUploader
                    className={this.props.isCreating ? 'd-none' : 'd-block'}
                >
                    <Dropzone
                        onDrop={this.handleDrop.bind(this)}
                        accept="image/*"
                        style={{}}
                    >
                        <span className="app-text-color-soft-white">
                            <UploadIcon>
                                <FontAwesomeIcon icon="folder-plus" />
                            </UploadIcon>
                            <UploadIconLabel>&nbsp;追加</UploadIconLabel>
                        </span>
                    </Dropzone>
                </GraphicUploader>
                <UploadingStatus
                    className={`app-text-color-soft-white ${
                        this.props.isCreating ? 'd-block' : 'd-none'
                    }`}
                >
                    <FontAwesomeIcon icon="spinner" spin />
                </UploadingStatus>
            </GraphicManagerContainer>
        )
    }
}

const GraphicManagerContainer = styled.div`
    position: relative;
`

const GraphicScrollList = styled.div`
    position: relative;
    width: 600px;
    height: 250px;
    padding: 15px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
`

const selectedElementStyle = css`
    border: solid 6px #ec9f05;
`

const unselectElementStyle = css`
    border: 6px solid rgba(0, 0, 0, 0);
`

const GraphicLabel = styled.label`
    position: relative;
    margin-right: 10px;
    cursor: pointer;
    width: 122px;
    height: 122px;
`

const GraphicSelector = styled.input`
    display: none;
`

const GraphicThumbnail = styled.img`
    position: absolute;
    margin: auto;
    width: 110px;
    height: 110px;
    object-fit: contain;
`

const GraphicUploader = styled.div`
    position: absolute;
    width: 200px;
    height: 20px;
    right: 20px;
    bottom: 20px;
    cursor: pointer;
    text-align: right;
    &:hover {
        opacity: 0.7;
    }
`

const UploadIcon = styled.span`
    font-size: 25px;
`

const UploadIconLabel = styled.span`
    padding-left: 10px;
    font-size: 15px;
`

const UploadingStatus = styled.div`
    position: absolute;
    width: 40px;
    height: 40px;
    font-size: 40px;
    top: 200px;
    right: 30px;
`
