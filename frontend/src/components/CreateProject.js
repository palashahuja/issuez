import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useState } from 'react';
import { Button, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, FormGroup, Input, Label, Table } from 'reactstrap';
import '../App.css';
import '../InputTag.css';
import AlertContextProvider from './AlertContext';

const InputTag = (props) => {
    let tags = props.inputVal;
    let setTags = props.changeData;
    const [tagValue, setTagValue] = useState('');

    const removeTag = (i) => {
        const newTags = [...tags];
        newTags.splice(i, 1);
        setTags(newTags);
    }

    const inputKeyDown = (e) => {
        const val = e.target.value;
        if (e.key === 'Enter' && val) {
            if (tags.find(tag => tag.toLowerCase() === val.toLowerCase())) {
                return;
            }
            // this.setState({ tags: [...this.state.tags, val] });
            setTags([...tags, val]);
            setTagValue('');
        } else if (e.key === 'Backspace' && !val) {
            // this.removeTag(this.state.tags.length - 1);
            removeTag(tags.length - 1);
        } else if (val) {
            setTagValue(val);
        }
    }

    return (<div className="input-tag w-75">
        <ul className="input-tag__tags">
            {tags.map((tag, i) => (
                <li key={tag}>
                    {tag}
                    <button type="button" onClick={() => { removeTag(i); }}>+</button>
                </li>
            ))}
            <li className="input-tag__tags__input"><input type="text" onChange={e => setTagValue(e.target.value)} onKeyDown={inputKeyDown} value={tagValue} /></li>
        </ul>
    </div>);
}


// two major components 
// and EdgesRow


const isNullOrUndefined = (str) => {
    return (!str || /^\s*$/.test(str));
};

const EdgeRow = (props) => {
    // two dropdown opens for each state
    const [fromDrop, setFrom] = useState(false);
    const [toDrop, setTo] = useState(false);
    const toggleFrom = () => setFrom(state => !state);
    const toggleTo = () => setTo(state => !state);
    let isDisabled = props.id === 0 && props.edge_from === 'NULL';
    return (<tr>
        <th scope="row">{props.id + 1}</th>
        <td >
            <Dropdown disabled={isDisabled} isOpen={fromDrop} toggle={toggleFrom}>
                <DropdownToggle style={{ padding: 5 }} color="info" disabled={isDisabled} caret>
                    {props.edge_from === 'NULL' ? 'Start' : props.edge_from}
                </DropdownToggle>
                <DropdownMenu>
                    {props.states.map((item, index) =>
                        <DropdownItem key={index} onClick={() => { props.edgeHandler(props.id, 0, item) }} >{item === 'NULL' ? 'Start' : item}</DropdownItem>
                    )}
                </DropdownMenu>
            </Dropdown>
        </td>
        <td>
            <Dropdown isOpen={toDrop} toggle={toggleTo}>
                <DropdownToggle style={{ padding: 5 }} color="info" caret>
                    {props.edge_to}
                </DropdownToggle>
                <DropdownMenu>
                    {props.states.map((item, index) =>
                        item !== 'NULL' ? <DropdownItem key={index} onClick={() => { props.edgeHandler(props.id, 1, item) }}>{item}</DropdownItem> : null
                    )}
                </DropdownMenu>
            </Dropdown>
        </td>
        <td>
            {props.id !== 0 && <Button type='button' color="primary" onClick={() => props.deleteHandler(props.id)}>Delete</Button>}
        </td>
    </tr>)
}


const CreateProjectPage = (props) => {
    // first ask the user for all the relevant statuses 
    // then ask the user for edges between the nodes 
    const [showNodes, setShowNodes] = useState(true);
    const [showEdges, setShowEdges] = useState(false);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    // const edges = []; // create a list of edges
    const [title, setTitle] = useState(' ');
    const [description, setDescription] = useState(' ');
    // const [showDialog, setShowDialog] = useState(false);
    // const [message, setMessage] = useState('');
    const showMessage = useContext(AlertContextProvider).showMessage;

    const deleteHandler = (id) => {
        let newEdges = [...edges];
        newEdges.splice(id, 1);
        setEdges(newEdges);
    }


    const internalEdgeHandler = (id, edge_index, val) => {
        let newEdges = [...edges];
        if (newEdges[id][edge_index] !== val) {
            newEdges[id][edge_index] = val;
            setEdges(newEdges);
        }
    }


    if (showEdges) {
        if (edges.length === 0) {
            setEdges([['NULL', nodes[0]]]);
        }
    }


    return (<div>
        <h1 className="HeaderFontFamily" style={{ marginTop: 10 }}>Create Project</h1>
        {showNodes &&
            <Form>
                <FormGroup row>
                    <Label sm={2} style={{ fontWeight: 'bold', fontSize: 20 }} className="LineFontFamily">Enter Name:</Label>
                    <Col sm={10}>
                        <Input value={title} onChange={e => setTitle(e.target.value)} type="text" name="title" id="inputTitle" className="w-75"></Input>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={2} style={{ fontWeight: 'bold', fontSize: 20 }} className="LineFontFamily">Enter Description:</Label>
                    <Col sm={10}>
                        <Input value={description} onChange={e => setDescription(e.target.value)} type="text" name="description" id="inputDescription" className="w-75"></Input>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={2} style={{ fontWeight: 'bold', fontSize: 20 }} className="LineFontFamily">Enter Statuses:</Label>
                    <Col sm={10}>
                        <InputTag changeData={setNodes} inputVal={nodes} />
                    </Col>
                </FormGroup>
                <Button color='primary' type='button' onClick={() => {
                    if (isNullOrUndefined(title)) {
                        showMessage('title is empty');
                        return;
                    }
                    if (isNullOrUndefined(description)) {
                        showMessage('description is empty');
                        return;
                    }
                    if (nodes.length <= 1) {
                        showMessage('There should be more than one node!');
                        return;
                    }
                    let newNodes = [...nodes];
                    newNodes.push('NULL');
                    setNodes(newNodes);
                    setShowNodes(false);
                    setShowEdges(true);
                }}>Submit</Button>

            </Form>}
        {showEdges && <Form>
            <FormGroup row style={{ marginTop: 10 }}>
                <Col>
                    <Table hover className="w-75" style={{ margin: 'auto', display: 'auto' }}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>From Status</th>
                                <th>To Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {edges.map((item, index) => <EdgeRow edgeHandler={internalEdgeHandler} edge_from={item[0]} edge_to={item[1]} key={index} states={nodes} deleteHandler={deleteHandler} id={index} />)}
                        </tbody>
                    </Table>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Col>
                    <Button color='primary' type='button' onClick={() => {
                        let currentEdges = [...edges];
                        currentEdges.push([nodes[0], nodes[1]]);
                        setEdges(currentEdges);
                        // let [currentEdge, edgeHandler] = useState([nodes[0], nodes[1]]);
                        // edges.push([currentEdge, edgeHandler])
                    }}>Add Edge</Button>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Col>
                    <Button color='primary' type='button' onClick={() => {
                        let u = {}
                        for(var i = 0; i < edges.length; i++){
                            if(!u.hasOwnProperty(edges[i])){
                                if(edges[i][0] === edges[i][1]){
                                    showMessage('There are self-loop edges. Please remove them!');
                                    return;
                                }
                                u[edges[i]] = 1;
                            }
                            else {
                                showMessage('There are duplicate edges. Please remove them!');
                                return;
                            }
                        }
                        var startNode = 'NULL';
                        var adjList = {};
                        for(i = 0; i < nodes.length; i++){
                            adjList[nodes[i]] = [];
                        }
                        for(i = 0; i < edges.length; i++){
                            adjList[edges[i][0]].push(edges[i][1]);
                        }
                        console.log(adjList);
                        var stack = [];
                        var visited = [];
                        stack.push(startNode); visited.push(startNode);
                        while(stack.length > 0){
                            let top = stack.pop();
                            for(i = 0; i < adjList[top].length; i++){
                                if(adjList[top][i] in visited) continue;
                                visited.push(adjList[top][i]);
                                stack.push(adjList[top][i]);
                            }
                        }
                        if(visited.length !== nodes.length){
                            showMessage('Some nodes are not covered by the given edges. Please check!');
                            return;
                        }
                    }}>Submit</Button>
                </Col>
            </FormGroup>
        </Form>}

    </div >);

}




export default CreateProjectPage;