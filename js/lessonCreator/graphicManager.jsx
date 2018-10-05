import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dropzone from 'react-dropzone';
import LessonUtility from '../common/lessonUtility';

export default class GraphicManager extends React.Component {
    constructor(props) {
        super(props);

        this.state ={
            graphics:           [],
            selectedGraphicIDs: [],
        };
    }

    async componentWillMount() {
        const graphics = await LessonUtility.fetchGraphics().catch((err) => {
            console.error(err);
            // modal
        });
        this.setState({ graphics: graphics });
    }

    async _changeGraphicSelection(event) {
        let graphicIDs = this.state.selectedGraphicIDs;

        const changedID = event.target.value;
        if (event.target.checked) {
            graphicIDs.push(changedID);
        } else {
            graphicIDs = graphicIDs.filter((id) => { return id != changedID; });
        }

        await this.setState({ selectedGraphicIDs: graphicIDs});

        this.props.changeGraphics(this.state.selectedGraphicIDs);
    }

    async _onDrop(acceptedFiles) {
        if (this.props.isCreating) return;
        if (acceptedFiles.lenth == 0) return;

        this.props.changeCreatingStatus(true);

        const newGraphics = await LessonUtility.uploadGraphics(acceptedFiles);
        const graphics = this.state.graphics.concat(newGraphics);
        this.setState({ graphics: graphics });

        this.props.changeCreatingStatus(false);
    }

    render() {
        return(
            <div id="graphic-manager" className="app-back-color-dark-gray">
                <div id="graphic-scroll-selector">{
                    this.state.graphics.map((graphic, i) => {
                        const isSelected = this.state.selectedGraphicIDs.includes(graphic.id);
                        return <label key={i} className={isSelected ? "checkable-thumbnail selected-element" : "checkable-thumbnail nonselected-element"}>
                            <img src={graphic.thumbnailURL} />
                            <input type="checkbox" value={graphic.id} checked={isSelected} onChange={this._changeGraphicSelection.bind(this)} />
                        </label>
                    })
                }</div>
                <div id="upload-graphic" className={this.props.isCreating ? 'd-none' : 'd-block'}>
                    <Dropzone onDrop={this._onDrop.bind(this)} accept="image/*" style={{}}>
                        <span className="app-text-color-soft-white">
                            <span id="upload-graphic-icon"><FontAwesomeIcon icon="folder-plus" /></span>
                            <span id="upload-graphic-text">&nbsp;追加</span>
                        </span>
                    </Dropzone>
                </div>
                <div id ="upload-loading-icon" className={this.props.isCreating ? 'app-text-color-soft-white d-block' : 'app-text-color-soft-white d-none'}>
                    <FontAwesomeIcon icon="spinner" spin />
                </div>
                <style jsx>{`
                    #graphic-manager {
                        position: relative;
                    }
                    #graphic-scroll-selector {
                        position: relative;
                        width: 600px;
                        height: 250px;
                        padding: 15px;
                        overflow-y: scroll;
                    }
                    #graphic-scroll-selector::-webkit-scrollbar {
                        display:none;
                    }
                    .checkable-thumbnail  {
                        position: relative;
                        margin-right: 10px;
                        cursor: pointer;
                        width: 122px;
                        height: 122px;
                    }
                    .checkable-thumbnail input {
                        display: none;
                    }
                    .checkable-thumbnail img {
                        position: absolute;
                        margin: auto;
                        width: 110px;
                        height: 110px;
                        object-fit: contain;
                    }
                    .nonselected-element {
                        border: 6px solid rgba(255, 0, 0, 0);
                    }
                    .selected-element {
                        border: solid 6px #ec9f05;
                    }
                    #upload-graphic {
                        position: absolute;
                        width: 200px;
                        height: 20px;
                        right: 20px;
                        bottom: 20px;
                        cursor: pointer;
                        text-align: right;
                    }
                    #upload-graphic:hover {
                        opacity: 0.7;
                    }
                    #upload-graphic-icon {
                        font-size: 25px;
                    }
                    #upload-graphic-text {
                        padding-left: 10px;
                        font-size: 15px;
                    }
                    #upload-loading-icon {
                        position: absolute;
                        width: 40px;
                        height: 40px;
                        font-size: 40px;
                        top: 200px;
                        right: 30px;
                    }
                `}</style>
            </div>
        )
    }
}