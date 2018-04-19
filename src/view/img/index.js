import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import ImageView from '../../component/ImageView'

class App extends React.Component {
    render(){ // Every react component has a render method.
        return( // Every render method returns jsx. Jsx looks like HTML, but it's actually javascript and functions a lot like xml, with self closing tags requiring the `/` within the tag in order to work propperly
            <div>
                    <ImageView/>
        </div>
    );
    }
}
ReactDOM.render(<App/>, document.getElementById('app'));