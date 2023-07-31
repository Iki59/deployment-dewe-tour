import {Container, InputGroup, Form, Button} from "react-bootstrap"

const style = {
    btnSearch: {
        background: "#FFAF00",
        border: "none",
        padding: "7px 30px"
    }
}

function Search(props) {
    return (
        <>
        <Container className="mt-5">
            <p style={{fontSize:"16px", fontFamily:"product-sans", color:"white", fontWeight:"400", marginBottom:"5px"}}>Find great places to holiday</p>
            <InputGroup>
                <Form.Control type="text" value={props.value} name={props.name} onChange={props.onChange}/>
                <Button onClick={props.onClick} style={style.btnSearch}>Search</Button>
            </InputGroup>
        </Container>
        </>
    )
}

export default Search