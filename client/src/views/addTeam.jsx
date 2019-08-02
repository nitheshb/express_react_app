import React from "react";
import axios from "axios";
import proxy from "http-proxy-middleware";
import {db, storage} from "../firebaseConfig";
import { filter } from 'rxjs/operators';
import { collectionData } from 'rxfire/firestore';
import 'firebase/firestore';
import {findIndex, isMatch} from "lodash";

// reactstrap components
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  FormGroup,
  Form,
  Input,
  Container,
  Table,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Row,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  UncontrolledTooltip
} from "reactstrap";
// core components
import UserHeader from "../components/Headers/UserHeader.jsx";

class addTeam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: '', players: [], searchText: '', selctedPlayersList:[], show: false,teams: [], selTeam:[]};
        this.playersData = [];
        this.selPlayerData =[];
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        // this.deletePlayer = this.deletePlayer.bind(this);
        this.unSelectPlayer = this.unSelectPlayer.bind(this);
      }
     
      componentDidMount() {
        var citiesRef = db.collection('Playit');
        var TeamDirectory = db.collection("TeamDirectory");

        // players list fetcher from players Directory called Playit
collectionData(citiesRef, 'id').subscribe(todos => {
  console.log("check with data", todos)

  this.setState({
            players: todos
          });
});

collectionData(TeamDirectory, 'id').subscribe(team => {
  console.log("check with data", team)

  this.setState({
            teams: team
          });
});
 

       }
       selectPlayer(key,e){
        // var index = this.selPlayerData.indexOf(e.target.value);

      var index =  findIndex(this.selPlayerData, (o) => { return isMatch(o, key) });
        

        if (index !== -1) {
            console.log("it is existed", index);
            this.selPlayerData.splice(index, 1);
            this.setState({selctedPlayersList: this.selPlayerData});
        }else{
         console.log("player is selected", key, index);
         this.selPlayerData.push(key);
         this.setState({selctedPlayersList: this.selPlayerData});
      }
       }
       selTeam(team,e){
         console.log("team is", team);
         this.selPlayerData = team.team_members;

         this.setState({selctedPlayersList: team.team_members});
       }
       deletePlayer(key,e ){
        db.collection('Playit').doc(key.id).delete();
        console.log('delete is pressed1', key);
    }
    deleteTeam(key,e){
      db.collection('TeamDirectory').doc(key.id).delete();
      console.log("team is deleted", key.id);
    }
    unSelectPlayer(key){
      var index =  findIndex(this.selPlayerData, (o) => { return isMatch(o, key) });
      this.selPlayerData.splice(index, 1);
      this.setState({selctedPlayersList: this.selPlayerData});
    }
    
      handleChange(event) {
        this.setState({value: event.target.value});
      }
      updateSearch(event){
        console.log("search it is checkedd",event.target.value);

        this.setState({searchText: event.target.value.substr(0,20)});

      }

      handleClose() {

        this.setState({ show: false });
      }
    
      handleShow() {
        console.log("shoe modal");
        this.setState({ show: true });
      }
    
      handleSubmit(e) {
        
          console.log(e.target[0].value, e.target[1].value);
        alert('A name was submitted: ' + this.state.value);
        e.preventDefault();
        const newTeam = {
          team_name: e.target[0].value,
          team_members: this.state.selctedPlayersList,
        }
        var file = e.target[1].files[0];
        //   // create a storage ref
        var storageRef = storage.ref('Team/'+ file.name);
         //   // upload file
         storageRef.put(file).then(function(snapshot){
          console.log("uploadded blog or file  ", snapshot.metadata.fullPath);

         storage.ref(snapshot.metadata.fullPath).getDownloadURL().then(function(url){
          newTeam.teamPic_url = url;
          
           console.log("ulr is ", newTeam);
           db.collection('TeamDirectory').add(newTeam).then(data => {
             console.log("data is ");
             alert ("saved successfully");
           })
         })

        })


 
      }
    
  render() {
    let filteredPlayers = this.state.players.filter(
      (player) => {
        return player.player_name.toLowerCase().indexOf(
          this.state.searchText) !== -1;
      }
    )
    return (
      <>
        <UserHeader />
        <Button variant="primary" onClick={this.handleShow}>
          Launch demo modal
        </Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <ModalHeader closeButton>
            {/* <Modal.Title>Modal heading</Modal.Title> */}
          </ModalHeader>
          <ModalBody>Woohoo, you're reading this text in a modal!</ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Save Changes
            </Button>
          </ModalFooter>
        </Modal>
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
              <Card className="bg-secondary shadow">
                <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                  <div className="d-flex justify-content-between">
                      <h3 className="">Team Selection</h3>
                    <Button
                      className="float-right"
                      color="default"
                      href="#pablo"
                      onClick={e => e.preventDefault()}
                      size="sm"
                    >
                      Message
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={this.handleSubmit}>
                    <div className="pl-lg-4">
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-teamname"
                            >
                              Team Name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue=""
                              id="input-teamname"
                              placeholder="India"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-ImageUrl"
                            >
                              Team Image
                            </label>
                            <Input
                            className="my-4"
                              id="input-teamPic"
                              type="file"
                            />
                          </FormGroup>
                        </Col>
                      </Row>


                     
                      <Row>
                          <Col>
                          <FormGroup>
                                     <div className="text-center">
                  <Button className="my-4" color="primary" type="submit">
                    Save Team
                  </Button>
                </div>
                          </FormGroup>
                          </Col>
                      </Row>
                      <Row>
                      <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                    <th scope="col">S.no</th>
                      <th scope="col">Name</th>
                      <th scope="col">Category</th>
                      <th scope="col">Team</th>
                      <th scope="col">value</th>
                    </tr>
                  </thead>
                  <tbody>
                      {this.state.selctedPlayersList.map((player,index) => 
                        <tr key={index}>
                        <td>{index+ 1}</td>
                    <th scope="row">
                      <Media className="align-items-center">
                        <a
                          className="avatar rounded-circle mr-3"
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          <img
                            alt="..."
                            src={player.pic_url}
                          />
                        </a>
                        <Media>
                          <span className="mb-0 text-sm">
                          {player.player_name}
                          </span>
                        </Media>
                      </Media>
                    </th>
                    <td>{player.category}</td>
                    <td>{player.team_name}</td>
                    <td>{player.base_price}</td>

                    <td onClick={this.unSelectPlayer.bind(this, player)}><i className="ni ni-fat-remove"></i></td>
                    </tr>
                        )}

                    <tr></tr>
                    </tbody>
                  </Table>
                      </Row>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col className="order-xl-1" xl="4">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">Teams Directory</h3>
                    </Col>
                    <Col className="text-right" xs="4">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                        size="sm"
                      >
                        Settings
                      </Button>
                    </Col>
                  </Row>
                  
                </CardHeader>
                <CardBody>
                <Row>
                    <Col xs="8" className="mb-4 mt-4 text-right">
                    <Input
                              className="form-control-alternative"
                              defaultValue=""
                              id="input-search-text"
                              placeholder="search player"
                              type="text"
                              onChange={this.updateSearch.bind(this)}
                            />
                    </Col>
                  </Row>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                    <th scope="col">S.no</th>
                      <th scope="col">Name</th>
                      <th scope="col">Team</th>
                    </tr>
                  </thead>
                  <tbody>
                      {this.state.teams.map((team,index) => 
                        <tr key={index} onClick={this.selTeam.bind(this, team)} >
                        <td>{index+ 1}</td>
                    <th scope="row">
                      <Media className="align-items-center">
                        <a
                          className="avatar rounded-circle mr-3"
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          <img
                            alt="..."
                            src={team.teamPic_url}
                          />
                        </a>
                        <Media>
                          <span className="mb-0 text-sm">
                          {team.team_name}
                          </span>
                        </Media>
                      </Media>
                    </th>
                    {/* <td>{team.team_members}</td> */}
                    <td onClick={this.deleteTeam.bind(this, team)}><i className="ni ni-fat-remove"></i></td>
                    </tr>
                        )}

                    <tr></tr>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
            {/* third column */}
            <Col className="order-xl-3" xl="4">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">Players Directory</h3>
                    </Col>
                    <Col className="text-right" xs="4">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                        size="sm"
                      >
                        Settings
                      </Button>
                    </Col>
                  </Row>
                  
                </CardHeader>
                <CardBody>
                <Row>
                    <Col xs="8" className="mb-4 mt-4 text-right">
                    <Input
                              className="form-control-alternative"
                              defaultValue=""
                              id="input-search-text"
                              placeholder="search player"
                              type="text"
                              onChange={this.updateSearch.bind(this)}
                            />
                    </Col>
                  </Row>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                    <th scope="col">S.no</th>
                      <th scope="col">Name</th>
                      <th scope="col">Category</th>
                      <th scope="col">value</th>
                    </tr>
                  </thead>
                  <tbody>
                      {filteredPlayers.map((player,index) => 
                        <tr key={index} onClick={this.selectPlayer.bind(this, player)}>
                        <td>{index+ 1}</td>
                    <th scope="row">
                      <Media className="align-items-center">
                        <a
                          className="avatar rounded-circle mr-3"
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          <img
                            alt="..."
                            src={player.pic_url}
                          />
                        </a>
                        <Media>
                          <span className="mb-0 text-sm">
                          {player.player_name}
                          </span>
                        </Media>
                      </Media>
                    </th>
                    <td>{player.category}</td>
                    <td>{player.base_price}</td>

                    <td onClick={this.deletePlayer.bind(this, player)}><i className="ni ni-fat-remove"></i></td>
                    </tr>
                        )}

                    <tr></tr>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* details players table */}

          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Selected Team</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Points</th>
                      <th scope="col">actions</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.selTeam.map((player,index) => 
                    <tr key = {index}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <a
                            className="avatar rounded-circle mr-3"
                            href="#pablo"
                            onClick={e => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              src={require("../assets/img/theme/react.jpg")}
                            />
                          </a>
                          <Media>
                            <span className="mb-0 text-sm">
                              {player.player_name}
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <th>{player.points}</th>
                        <td className="text-right">
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#pablo"
                            role="button"
                            size="sm"
                            color=""
                            onClick={e => e.preventDefault()}
                          >
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem
                              href="#pablo"
                              onClick={e => e.preventDefault()}
                            >
                              Edit
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={e => e.preventDefault()}
                            >
                              Delete
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={e => e.preventDefault()}
                            >
                              Something else here
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  
                  )
                  }
                  </tbody>
                </Table>
                <CardFooter className="py-4">
                  <nav aria-label="...">
                    <Pagination
                      className="pagination justify-content-end mb-0"
                      listClassName="justify-content-end mb-0"
                    >
                      <PaginationItem className="disabled">
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                          tabIndex="-1"
                        >
                          <i className="fas fa-angle-left" />
                          <span className="sr-only">Previous</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem className="active">
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          2 <span className="sr-only">(current)</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          3
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          <i className="fas fa-angle-right" />
                          <span className="sr-only">Next</span>
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  </nav>
                </CardFooter>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default addTeam;
