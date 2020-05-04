import React, { useState } from 'react'
import { useHistory } from 'react-router';
import { ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
// custom component for list group item 
const CustomListComponent = (props) => {
    const [isActive, setActive] = useState(false);
    const history = useHistory();
    const activeChange = () => { setActive(!isActive) };
    // handle the clicking event here 
    const handleClick = () => {history.push("/project/" + props.item.project_id)};
    return (
        <ListGroupItem active={isActive} onMouseEnter={activeChange} onMouseLeave={activeChange} onClick={handleClick}>
            <ListGroupItemHeading className="LineFontFamily">{props.item.title}</ListGroupItemHeading>
            <ListGroupItemText className="LineFontFamily">{props.item.description}</ListGroupItemText>
        </ListGroupItem>
    );
}


export default CustomListComponent;
