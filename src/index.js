import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
const _range = (x) => {
    const a = [];
    for (var i = 0; i < x; i++) {
        a.push(i);
    }
    return a;
}
function apiFetcher(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var randomObj = JSON.parse(xhr.responseText);
            cb(randomObj);
        }
    }
    xhr.open('GET', url, true);
    xhr.send(null);
}
function apiFetcher2(url) {
    return new Promise((resolve) => {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                let randomObj = JSON.parse(xhr.responseText);
                resolve(randomObj);
            }
        }
        xhr.open('GET', url, true);
        xhr.send(null);
    });
}
class ParentProfileViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { rowInput: 0, columnInput: 0 };

    }
    handleSubmitButtonHit = (updatedRowCount, updatedColumnCount) => {
        this.setState({ rowInput: updatedRowCount, columnInput: updatedColumnCount });
    }
    render() {

        return (
            <div>
                <InputForm onSubmitButtonHit={this.handleSubmitButtonHit} />
                <DisplayProfiles rowInput={this.state.rowInput} columnInput={this.state.columnInput} />
            </div>
        );
    }
}
class InputForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { rowInput: 0, columnInput: 0 };
    }

    handleSubmit = () => this.props.onSubmitButtonHit(this.state.rowInput, this.state.columnInput);

    handleRowInputChange = (e) => this.setState({ rowInput: Number(e.target.value) });

    handleColumnInputChange = (e) => this.setState({ columnInput: Number(e.target.value) });

    render() {
        return (
            <div>
                <h1>Welcome to the Profile viewer application</h1>
                <label className="rowInputSection">
                    Rows:<input type="text" onChange={this.handleRowInputChange} />
                </label>
                <label className="columnInputSection">
                    Column:<input type="text" onChange={this.handleColumnInputChange} />
                </label>
                <button className="saveButton" onClick={this.handleSubmit}>Save</button>
            </div>
        );
    }
}
class DisplayProfiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
    }
    componentWillReceiveProps(nextProps) {
        const oldProps = this.props;
        if ((oldProps.rowInput != nextProps.rowInput) || (oldProps.columnInput != nextProps.columnInput)) {
            this.fetchIfRequired(nextProps);
        }
    }
    componentWillMount() {
        this.fetchIfRequired(this.props);
    }
    fetchIfRequired(props) {
        let noOfProfiles = props.rowInput * props.columnInput;
        if (noOfProfiles > this.state.data.length) {
            //apiFetcher('https://randomuser.me/api',this.addUser); (uncomment this for using with callbacks and comment the next line)
            apiFetcher2('https://randomuser.me/api').then(this.addUser); //(using promises)
        }
        if (noOfProfiles < this.state.data.length) {
            const nextState = { data: [...this.state.data.slice(0, noOfProfiles)] };
            this.setState(nextState);
        }
    }
    addUser = (userObj) => {
        let noOfProfiles = this.props.rowInput * this.props.columnInput;
        let checkState = this.state.data;
        const userProfile = {
            firstName: userObj.results[0].name.first,
            lastName: userObj.results[0].name.last,
            image: userObj.results[0].picture.large,
            email: userObj.results[0].email
        }
        const nextState = { data: [...this.state.data.slice(0), userProfile] };
        this.setState(nextState, () => {
            this.fetchIfRequired(this.props)
        }
        );

    }
    renderProfile = (userObj) => {
        return (<div><img src={userObj.image} /></div>);
    }
    renderRow = (i) => {
        //let index = i*this.props.columnInput+j;
        const profiles = [];
        _range(this.props.columnInput).map((v) => {
            const index = i * this.props.columnInput + v;
            if (index < this.state.data.length) {
                profiles.push(this.state.data[index]);
            }
        });

        return (<div className="rowContainer">{profiles.map(this.renderProfile)}</div>);
    }

    render() {
        let noOfProfiles = this.props.rowInput * this.props.columnInput;
        return (
            <div>
                <div className="container">{_range(this.props.rowInput).map(this.renderRow)}</div>
            </div>
        );
    }
}

ReactDOM.render(<ParentProfileViewer />, document.getElementById('root'));
registerServiceWorker();
