import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Dropzone from 'react-dropzone'
import AvatarRightsChecker from './utils/avatarRightsChecker'
import { fetchAvatars, uploadAvatar } from '../common/networkManager'

const defaultThumbnailURL =
    'https://storage.googleapis.com/teraconn_thumbnail/avatar/default.png'
const userAvatarFileErrorTitle = '使用できないファイルです'
const failedDownloadingAvatarFile = 'アバターの読み込みに失敗しました'
const failedUploadingAvatarFile = 'アバターのアップロードに失敗しました'
const userAvatarFileErrorMessage =
    '下記の条件を確認してください。\n\n・VRoid Studioで作成したVRMファイルである\n・ライセンスがCC0である\n・ファイルサイズが30MB以下である'
const maxFileBytes = 31457280

export default class AvatarManager extends React.Component {
    constructor(props) {
        super(props)

        this.checker = new AvatarRightsChecker()
        this.state = {
            hasAddedAvatar: false,
            selectedAvatarID: '',
            avatars: []
        }
    }

    componentWillMount() {
        fetchAvatars()
            .then(avatars => {
                this.setState({ avatars: avatars })
            })
            .catch(err => {
                this.props.onError(failedDownloadingAvatarFile, err, () => {
                    location.reload()
                })
            })
    }

    changeAvatarSelection(event) {
        const id = event.target.value // can't unchecked after checked once.
        this.setState({ selectedAvatarID: id })
        this.props.onAvatarChange(id)
    }

    async onDrop(acceptedFiles, rejectedFiles) {
        if (this.props.isCreating) return

        if (rejectedFiles.length > 0) {
            this.props.onError(
                userAvatarFileErrorTitle,
                userAvatarFileErrorMessage
            )
            return
        }

        if (acceptedFiles.length == 0) return

        this.createNewAvatar(acceptedFiles[0])
    }

    async createNewAvatar(file) {
        this.props.onStatusChange(true)

        const url = file.preview
        await this.checker.loadAvatar(url)

        if (!this.checker.isEnableAvatar()) {
            this.props.onError(
                userAvatarFileErrorTitle,
                userAvatarFileErrorMessage
            )

            this.props.onStatusChange(false)
            return
        }

        uploadAvatar(url)
            .then(id => {
                const avatars = this.state.avatars
                avatars.push({ id: id })

                this.setState({ avatars: avatars, hasAddedAvatar: true })
                this.props.onStatusChange(false)
            })
            .catch(err => {
                this.props.onError(failedUploadingAvatarFile, err)
            })
    }

    render() {
        return (
            <div id="avatar-manager" className="app-back-color-dark-gray">
                <div className="form-inline">
                    {this.state.avatars.map((avatar, i) => {
                        const isSelected =
                            avatar.id == this.state.selectedAvatarID
                        return (
                            <label
                                key={i}
                                className={
                                    isSelected
                                        ? 'checkable-thumbnail selected-element'
                                        : 'checkable-thumbnail nonselected-element'
                                }
                            >
                                <img
                                    src={
                                        avatar.thumbnailURL
                                            ? avatar.thumbnailURL
                                            : defaultThumbnailURL
                                    }
                                />
                                <input
                                    type="checkbox"
                                    value={avatar.id}
                                    checked={isSelected}
                                    onChange={this.changeAvatarSelection.bind(
                                        this
                                    )}
                                />
                            </label>
                        )
                    })}
                    <div
                        id="upload-avatar"
                        className={
                            this.props.isCreating || this.state.hasAddedAvatar
                                ? 'd-none'
                                : 'd-block'
                        }
                        data-tip="VRMファイルは、授業再生のため再配布されます。画面右上の「使い方」をご確認ください。"
                    >
                        <Dropzone
                            onDrop={this.onDrop.bind(this)}
                            accept=".vrm"
                            maxSize={maxFileBytes}
                            multiple={false}
                            style={{
                                width: '100px',
                                height: '100px',
                                position: 'absolute'
                            }}
                        >
                            <div
                                id="upload-avatar-icon"
                                className="app-text-color-soft-white"
                            >
                                <FontAwesomeIcon icon="file-upload" />
                            </div>
                            <div
                                id="upload-avatar-text"
                                className="app-text-color-soft-white"
                            >
                                &nbsp;追加
                            </div>
                        </Dropzone>
                    </div>
                    <div
                        id="upload-loading-status"
                        className={this.props.isCreating ? 'd-block' : 'd-none'}
                    >
                        <div
                            id="upload-loading-icon"
                            className="app-text-color-soft-white"
                        >
                            <FontAwesomeIcon icon="spinner" spin />
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .selected-element {
                        border: solid 6px #ec9f05;
                    }
                    .nonselected-element {
                        border: 6px solid rgba(0, 0, 0, 0);
                    }
                    #avatar-manager {
                        position: relative;
                        padding: 15px;
                        width: 600px;
                        height: 140px;
                    }
                    #avatar-manager::-webkit-scrollbar {
                        display: none;
                    }
                    #avatar-manager img {
                        width: 100px;
                        height: 100px;
                    }
                    .checkable-thumbnail {
                        width: 110px;
                        height: 110px;
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
                    #upload-avatar {
                        position: relative;
                        width: 100px;
                        height: 100px;
                        border: 2px dashed white;
                        cursor: pointer;
                    }
                    #upload-avatar:hover {
                        opacity: 0.7;
                    }
                    #upload-avatar-icon {
                        position: absolute;
                        width: 40px;
                        height: 40px;
                        font-size: 40px;
                        text-align: center;
                        top: 20%;
                        left: 0;
                        right: 0;
                        margin: auto;
                    }
                    #upload-avatar-text {
                        position: absolute;
                        width: 100%;
                        text-align: center;
                        bottom: 20%;
                        font-size: 12px;
                    }
                    #upload-loading-status {
                        position: relative;
                        width: 100px;
                        height: 100px;
                    }
                    #upload-loading-icon {
                        position: absolute;
                        width: 40px;
                        height: 40px;
                        font-size: 40px;
                        top: 0;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        margin: auto;
                    }
                `}</style>
            </div>
        )
    }
}
