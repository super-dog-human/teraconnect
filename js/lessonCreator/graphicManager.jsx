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

    _onDrop(acceptedFiles, rejectedFiles) {
        if (rejectedFiles) {

        }
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
                <div id="upload-graphic">
                    <Dropzone onDrop={this._onDrop.bind(this)} accept="image/*" style={{}}>
                        <span className="app-text-color-soft-white">
                            <span id="upload-graphic-icon"><FontAwesomeIcon icon="folder-plus" /></span>
                            <span id="upload-graphic-text">&nbsp;追加</span>
                        </span>
                    </Dropzone>
                </div>
                <style jsx>{`
                    .nonselected-element {
                        border: 6px solid rgba(255, 0, 0, 0);
                    }
                    .selected-element {
                        border: solid 6px #ec9f05;
                    }
                    #graphic-manager {
                        position: relative;
                        width: 600px;
                        height: 200px;
                        padding: 15px;
                        overflow-y: scroll;
                        overflow: scroll;
                    }
                    #graphic-scroll-selector {
                        width 100%;
                    }
                    #graphic-manager img {
                        max-width: 110px;
                        max-height: 100px;
                    }
                    .checkable-thumbnail  {
                        position: relative;
                        margin-right: 10px;
                        cursor: pointer;
                    }
                    .checkable-thumbnail input {
                        display: none;
                        position: absolute;
                        top: 0;
                        right: 0;
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
                    #upload-graphic-icon {
                        font-size: 25px;
                    }
                    #upload-graphic-text {
                        padding-left: 10px;
                        font-size: 15px;
                    }
                `}</style>
            </div>
        )
    }
}