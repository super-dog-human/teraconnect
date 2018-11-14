import React from 'react';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="login" className="center-block">
                <form>
                    <div class="form-group">
                        <label for="exampleInputEmail1">アカウントID</label>
                        <input type="text" class="form-control" id="exampleInputEmail1" placeholder="アカウントID" />
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">パスワード</label>
                        <input type="text" class="form-control" id="exampleInputEmail1" placeholder="パスワード" />
                    </div>
                    <button>ログイン</button>
                </form>
            </div>
        );
    }
}