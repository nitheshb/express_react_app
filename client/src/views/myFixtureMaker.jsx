import React from "react";
import axios from "axios";
import proxy from "http-proxy-middleware";
import {db} from "../firebaseConfig";
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

class myFitureMaker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: '', players: [], searchText: '', selctedPlayersList:[], show: false,teams: [], selTeam:[], fixtures: [], myMatchFixtures: []};
        this.playersData = [];
        this.selPlayerData =[];
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        // this.deletePlayer = this.deletePlayer.bind(this);
      }
     
      componentDidMount() {
        var citiesRef = db.collection('Playit');
        var TeamDirectory = db.collection("TeamDirectory");
        var TodayFixtures = db.collection("TodayFixtures");
        var scheduleMaker = db.collection("scheduleMaker");

        // players list fetcher from players Directory called Playit
collectionData(citiesRef, 'id').subscribe(todos => {
  console.log("check with data", todos)

  this.setState({
            players: todos
          });
});

collectionData(scheduleMaker, 'id').subscribe(team => {
  console.log("check with data", team)

  this.setState({
            teams: team
          });
});

collectionData(TodayFixtures, 'id').subscribe(fixtures => {
  console.log("check with data", fixtures);

  this.setState({
            fixtures: fixtures
          });
});
 

        // var allCities = citiesRef.get()
        //   .then(snapshot => {
        //     snapshot.forEach(doc => {
        //       console.log(doc.id, '=>', doc.data());

        //       const { player_name, points,category, team_name } = doc.data();

        //       this.playersData.push({
        //         key: doc.id,
        //         player_name,
        //         team_name,
        //         category,
        //         points
        //       });

        //       this.setState({
        //         players: this.playersData
        //       });
        //     });
        //   })
        //   .catch(err => {
        //     console.log('Error getting documents', err);
        //   });
       }
       selectPlayer(key,e){
        // var index = this.selPlayerData.indexOf(e.target.value);

      var index =  findIndex(this.selPlayerData, (o) => { return isMatch(o, key) });
        

        if (index !== -1) {
            console.log("it is existed", index);
            this.selPlayerData.splice(index, 1);
            this.setState({selctedPlayersList: this.selPlayerData});
        }else{
         console.log("player is selected", key, index, key.matchDetails['unique_id']);
         this.selPlayerData.push(key);
         
         this.setState({selctedPlayersList: this.selPlayerData});
         console.log("value after push is", this.state.selctedPlayersList);
      }
      // calling db and update the state
     db.collection('TodayFixtures').where('mother_match_Id', '==', key.matchDetails['unique_id']).get().then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        this.setState({myMatchFixtures: []});
        return;
      }  
      console.log("completed fetched value is", snapshot);
      var x =[];
      // this.setState({myMatchFixtures: snapshot.data()})
      snapshot.forEach(doc => {
        x.push(doc.data());
        console.log(doc.id, '=>', doc.data());
        this.setState({myMatchFixtures: x});
        console.log("this.set", this.state.myMatchFixtures);
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });

     

      // collectionData(TodayFixtures, 'id').subscribe(fixtures => {
      //   console.log("selected Fixtures", fixtures);
      
      //   // this.setState({
      //   //           fixtures: fixtures
      //   //         });
      // });
       }
       selTeam(team,e){
         console.log("team is", team);

         this.setState({selctedPlayersList: team.team_members});
       }
       deletePlayer(key,e ){
        db.collection('scheduleMaker').doc(key.id).delete();
        console.log('delete is pressed1', key);
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
    
      async handleSubmit (e)  {
        
          console.log("selected data is -->", this.state.selctedPlayersList);
        
        e.preventDefault();
        const newTeam = {
          mother_match_Id: this.state.selctedPlayersList[0].matchDetails['unique_id'],
          title: e.target[0].value,
          end_time: e.target[1].value,
          max_players: e.target[2].value,
          fee: e.target[3].value,
          prize: e.target[4].value,
          bid_type: e.target[5].value,
          team_pics: [this.state.selctedPlayersList[0].matchDetails.team_1_pic, this.state.selctedPlayersList[0].matchDetails.team_2_pic],
          team: this.state.selctedPlayersList[0].squad,
        }

 const docRef = await db.collection('TodayFixtures').add(newTeam);

 alert('A fixture was submitted: ',docRef);

 console.log('added ref is ', docRef,docRef.id);

 
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
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
              <Card className="bg-secondary shadow">
                <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                  <div className="d-flex justify-content-between">
                      <h3 className="">Create Fixtures</h3>
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
                      <Col md="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-title"
                            >
                              Title
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue=""
                              id="input-title"
                              placeholder="3PM"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-endtime"
                            >
                              End Time
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue=""
                              id="input-endTime"
                              placeholder="3PM"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-maxplayers"
                            >
                              Max Players
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue=""
                              id="input-maxplayers"
                              placeholder="10"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-fee"
                            >
                              Fee
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue=""
                              id="input-fee"
                              placeholder="100"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-prizemoney"
                            >
                              Prize Amount
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue=""
                              id="input-prizemoney"
                              placeholder="800"
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
                              Type
                            </label>
                            <Input type="select" name="select" id="exampleSelect">
            <option>Bid</option>
            <option>Fantasy</option>
          </Input>
                          </FormGroup>
                        </Col>
                      </Row>


                     
                      <Row>
                          <Col>
                          <FormGroup>
                                     <div className="text-center">
                  <Button className="my-4" color="primary" type="submit">
                    Save Fixture
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
                      <th scope="col">Match Time</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                      {this.state.selctedPlayersList.map((player,index) => 
                        <tr key={index}>
                        <td>{index+ 1}</td>
                        <th scope="row">
                    <Media className="align-items-center">  
                      <div className="avatar-group">
                          <a
                            className="avatar avatar-sm"
                            href="#pablo"
                            id="tooltip731399078"
                            onClick={e => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              className="rounded-circle"
                              src={player.matchDetails.team_1_pic}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip731399078"
                          >
                            Ryan Tompson
                          </UncontrolledTooltip>
                          <a
                            className="avatar avatar-sm"
                            href="#pablo"
                            id="tooltip491083084"
                            onClick={e => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              className="rounded-circle"
                              src={player.matchDetails.team_2_pic}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip491083084"
                          >
                            Romina Hadid
                          </UncontrolledTooltip>
                         </div> 
                       
                          {/* <a
                            className="avatar rounded-circle mr-3"
                            href="#pablo"
                            onClick={e => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              src={fixture.team_pics[0]}
                            />
                          </a> */}
                          <Media>
                            <span className="mb-0 text-sm">
                              {player.matchDetails['team-1']} vs {player.matchDetails['team-2']}
                            </span>
                          </Media>
                        </Media>
                    </th>
                    <td>{player.matchDetails.dateTimeGMT}</td>
                    <td>{player.points}</td>

                    <td><i className="ni ni-fat-remove"></i></td>
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
            {/* 2nd column */}
            <Col className="order-xl-3" xl="4">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">Showing Matches</h3>
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
                      <th scope="col">Started</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                      {this.state.teams.map((player,index) => 
                        <tr key={index} onClick={this.selectPlayer.bind(this, player)}>
                        <td>{index+ 1}</td>
                    <th scope="row">
                    <Media className="align-items-center">  
                      <div className="avatar-group">
                          <a
                            className="avatar avatar-sm"
                            href="#pablo"
                            id="tooltip731399078"
                            onClick={e => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              className="rounded-circle"
                              src={player.matchDetails.team_1_pic}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip731399078"
                          >
                            Ryan Tompson
                          </UncontrolledTooltip>
                          <a
                            className="avatar avatar-sm"
                            href="#pablo"
                            id="tooltip491083084"
                            onClick={e => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              className="rounded-circle"
                              src={player.matchDetails.team_2_pic}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip491083084"
                          >
                            Romina Hadid
                          </UncontrolledTooltip>
                         </div> 
                       
                          {/* <a
                            className="avatar rounded-circle mr-3"
                            href="#pablo"
                            onClick={e => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              src={fixture.team_pics[0]}
                            />
                          </a> */}
                          <Media>
                            <span className="mb-0 text-sm">
                              {player.matchDetails['team-1']} vs {player.matchDetails['team-2']}
                            </span>
                          </Media>
                        </Media>
                    </th>
                    <td>{player.matchDetails.dateTimeGMT}</td>

                    <td onClick={this.deletePlayer.bind(this, player)}><i className="ni ni-fat-remove"></i></td>
                    </tr>
                        )}

                    <tr></tr>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>

            </Col>

            {/* end of second column */}
            {/* start of first column */}
             {/* third column */}
             <Col className="order-xl-3" xl="4">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">List Fixtures</h3>
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
                      <th scope="col">Team</th>
                      <th scope="col">value</th>
                    </tr>
                  </thead>
                  <tbody>
                      {this.state.myMatchFixtures.map((player,index) => 
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
                            src={player.team_pics[0]}
                          />
                        </a>
                        <Media>
                          <span className="mb-0 text-sm">
                          {player.title}
                          </span>
                        </Media>
                      </Media>
                    </th>
                    <td>{player['max_players']}</td>
                    <td>{player.fee}</td>
                    <td>{player.prize}</td>

                    <td onClick={this.deletePlayer.bind(this, player)}><i className="ni ni-fat-remove"></i></td>
                    </tr>
                        )}

                    <tr></tr>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
              
            </Col>
            {/* end of third column */}
          </Row>

          {/* details players table */}

          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">All Fixtures</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">s.no</th>
                      <th scope="col">Name</th>
                      <th scope="col">prize</th>
                      <th scope="col">fee</th>
                      <th scope="col">joined/max</th>
                      <th scope="col">actions</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.fixtures.map((fixture,index) => 
                  
                    <tr key = {index}>
                      <td>{index+ 1}</td>
                      <th scope="row">
                      <Media className="align-items-center">  
                      <div className="avatar-group">
                          <a
                            className="avatar avatar-sm"
                            href="#pablo"
                            id="tooltip731399078"
                            onClick={e => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              className="rounded-circle"
                              src={fixture.team_pics[0]}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip731399078"
                          >
                            Ryan Tompson
                          </UncontrolledTooltip>
                          <a
                            className="avatar avatar-sm"
                            href="#pablo"
                            id="tooltip491083084"
                            onClick={e => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              className="rounded-circle"
                              src={fixture.team_pics[1]}
                            />
                          </a>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip491083084"
                          >
                            Romina Hadid
                          </UncontrolledTooltip>
                         </div> 
                       
                          {/* <a
                            className="avatar rounded-circle mr-3"
                            href="#pablo"
                            onClick={e => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              src={fixture.team_pics[0]}
                            />
                          </a> */}
                          <Media>
                            <span className="mb-0 text-sm">
                              {fixture.title}
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>{fixture.prize}</td>
                      <td>{fixture.fee}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">60%</span>
                          <div>
                            <Progress
                              max="100"
                              value="60"
                              barClassName="bg-warning"
                            />
                          </div>
                        </div>
                      </td>
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

export default myFitureMaker;
