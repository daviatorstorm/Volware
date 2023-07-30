import React from 'react';
import { useParams } from 'react-router-dom';

class Home extends React.Component {
    render() {
        return (
            <div>
                <h1 className="text-green-800 text-4xl">Welcome to the Homepage</h1>
                <p>{JSON.stringify(this.props)}</p>
            </div>
        );
    }
};

function Home2(props) {
    const params = useParams();
    return (
        <div>
            <h1 className="text-green-800 text-4xl">Welcome to the Homepage</h1>
            {/* <p>{JSON.stringify(this.props)}</p> */}
            <p>{JSON.stringify(params)}</p>
        </div>
    );
}

export default Home2;
