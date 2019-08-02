import React from "react";
import axios from "axios";
import Moment from 'react-moment';
import proxy from "http-proxy-middleware";
import {db, storage} from "../firebaseConfig";
import { filter } from 'rxjs/operators';
import { collectionData } from 'rxfire/firestore';
import 'firebase/firestore';
import admin from 'firebase-admin';
import {findIndex, isMatch} from "lodash";

import serealiseFun  from '../jsUtils/serealizeData.js';

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
  UncontrolledTooltip
} from "reactstrap";
// core components
import UserHeader from "../components/Headers/UserHeader.jsx";
import { checkPropTypes } from "prop-types";

class showTodaySchedule extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
          schedules: [],
          squad: [],
          teamDetails: {},
          selPlayerIs: {},
          selMatch: {},
          fullM_Details: [],
          fireStoreMatchId: '',
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkData = this.checkData.bind(this);
        this.handleSubmitTeam = this.handleSubmitTeam.bind(this);
      }
     
      componentDidMount() { 
        // get data from api 
        axios.get(`https://cricapi.com/api/matches?apikey=bqkRrq7fhuVsEA7n04PHNsKEcru2`)
      .then(res => {
        const schedules = res.data.matches;
        console.log("fetched matches data is", schedules);
        this.setState({ schedules });
      });
       }

       selMatch(match, e){
         console.log("seleted match is", match);
         this.setState({selMatch: match});
         const matchId = match.unique_id;
        //  get the squad details
        axios.get(`https://cricapi.com/api/fantasySquad?apikey=bqkRrq7fhuVsEA7n04PHNsKEcru2&unique_id=${matchId}`)
        .then(res => {
          
          const squadArray = res.data.squad;
          let totalSquad = '';
          // add country value to it
            if(squadArray){
              squadArray[0].players.forEach(function(element) {
                element.team = squadArray[0].name;
              });
              // serealiseFun promise function will add team value to each player
              serealiseFun(squadArray[0].players,squadArray[0].name).then(team1 => {
                console.log('team1 is ', team1);
                serealiseFun(squadArray[1].players,squadArray[1].name).then(team2=> {
                  console.log('team2 is ', team2);
                  // format data to combine both teams together
                  totalSquad = [ ...team1, ...team2];
                  console.log('total Squad', totalSquad);
                  let finalFixtureData = {
                    matchDetails: this.state.selMatch,
                    squad: [ ...team1, ...team2]
                  };
                  // save to db
              db.collection('scheduleMaker').add(finalFixtureData).then(data => {
                console.log("data is ", data);
                console.log("fetch id", data._key.path.segments[1]);
                this.setState({fireStoreMatchId: data._key.path.segments[1] })
                
                db.collection('scheduleMaker').doc(data._key.path.segments[1]).get().then((snapshot) => {
                  console.log("values of fetchhed from db", snapshot.data());
                  var data = snapshot.data();
                  this.setState({squad: data.squad, teamDetails: data.matchDetails});
                })
                alert ("saved successfully");
              })
                });
              });
            }
        });
        //  save play details along with team 
       }
    
       checkData(data){
         console.log("triggered data is ", data);
       }

      //  on player selection he can add the pointer values along with there pic
      selPlayer(player, e){
        console.log("selected player is", player);
        this.setState({selPlayerIs: player});
      }
      handleSubmitTeam(e) {
        e.preventDefault();
        console.log("chheck for file data ", e.target[1].files[0]);
        var file = e.target[1].files[0];
        var file2 = e.target[3].files[0];

        console.log("falggs are", file, file2)
        //   // create a storage ref
        var storageRef = storage.ref('Team/'+ file.name);
         //   // upload file
         storageRef.put(file).then((snapshot)=>{
          console.log("uploadded blog or file  ", snapshot.metadata.fullPath);

         storage.ref(snapshot.metadata.fullPath).getDownloadURL().then((url)=>{
          
          var finalDetails = this.state.teamDetails;
          finalDetails.team_1_pic = url;
          var scheduleMakerRef = db.collection('scheduleMaker').doc(this.state.fireStoreMatchId);

          scheduleMakerRef.update({
            matchDetails: finalDetails
          }).then(() => {
            console.log("team flag is uploaded completed")
            // checkData(filteredSquad);
            // this.setState({squad : filteredSquad, selPlayerIs: {}});
            this.setState({teamDetails: finalDetails});

          }).catch((error) => {
            console.error("Write failed: "+error)
          });
         })

        })

        var storageRef1 = storage.ref('Team/'+ file2.name);

        // upload file 2
        storageRef1.put(file2).then((snapshot)=>{
          console.log("uploadded blog or file  ", snapshot.metadata.fullPath);

         storage.ref(snapshot.metadata.fullPath).getDownloadURL().then((url)=>{
          
          var finalDetails = this.state.teamDetails;
          finalDetails.team_2_pic = url;
          var scheduleMakerRef = db.collection('scheduleMaker').doc(this.state.fireStoreMatchId);

          scheduleMakerRef.update({
            matchDetails: finalDetails
          }).then(() => {
            console.log("team flag 2 is uploaded completed")
            // checkData(filteredSquad);
            // this.setState({squad : filteredSquad, selPlayerIs: {}});
            this.setState({teamDetails: finalDetails});

          }).catch((error) => {
            console.error("Write failed: "+error);
          });
         });

        });

      }
      handleSubmit(e) {
        e.preventDefault();

        // filter the upload data
        var fullSquad = this.state.squad;
        const newPlayer =  this.state.selPlayerIs;
        newPlayer.base_price = e.target[3].value;
        newPlayer.category= e.target[1].value;
          
        

        let dataUtil = {
          docId : this.state.fireStoreMatchId,
          selectedPlayer : this.state.selPlayerIs
        }

          console.log(e.target[0].value, e.target[3].value);
          // get file
          var file = e.target[5].files[0];
          console.log("chheck for file data ", e.target[5].files[0]);

        //   // create a storage ref
          var storageRef = storage.ref('players/'+ file.name);

        //   // upload file
         storageRef.put(file).then((snapshot)=>{
           console.log("uploadded blog or file  ", snapshot.metadata.fullPath);

          storage.ref(snapshot.metadata.fullPath).getDownloadURL().then((url) =>{
             newPlayer.pic_url = url;
           

            var washingtonRef = db.collection('scheduleMaker').doc(dataUtil.docId);

            // filter the old data and append new one

           var filteredSquad=  fullSquad.filter(player=> player.pid !== dataUtil.selectedPlayer.pid);

           
            
           var updatePlayerInfo= filteredSquad.push(newPlayer);

            console.log("selected array remove value is ", updatePlayerInfo);
            console.log("devil", filteredSquad);

            washingtonRef.update({
              squad: filteredSquad
            }).then(() => {
              console.log("Write completed")
              // checkData(filteredSquad);
              this.setState({squad : filteredSquad, selPlayerIs: {}});

            }).catch((error) => {
              console.error("Write failed: "+error)
            });
// // Atomically remove a region from the "regions" array field.
// var arrRm = washingtonRef.update({
//   squad: admin.firestore.FieldValue.arrayRemove(dataUtil.selectedPlayer)
// });

// // Atomically add a new region to the "regions" array field.
// var arrUnion = washingtonRef.update({
//   squad: admin.firestore.FieldValue.arrayUnion(updatePlayerInfo)
// });
          })

         })
         
  

  // db.collection('Playit').add(newPlayer);

 
      }
    
  render() {
    return (
      <>
        <UserHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>

          
          {/* details players table */}

          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Today Schedule</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive style= {{height: '700px','overflow-y': 'auto',overflow: 'auto',display: 'block'}}>
                  <thead className="thead-light">
                    <tr>
                      <th>s.no</th>
                      <th scope="col">M Id</th> 
                      <th scope="col">Name</th>
                      <th scope="col">Date</th>
                      <th scope="col">Squad</th>
                      <th scope="col">Type</th>
                      <th scope="col">Match Started</th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.schedules.map((match,index) => 
                    <tr key={index} onClick={this.selMatch.bind(this, match)}>
                      <td>{index +1}</td>
                      <td>{match.unique_id}</td>
                      <td scope="row">
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
                              {match['team-1']}  <span style= {{fontSize:'10px',color: 'orange'}}>vs</span> {match['team-2']}
                            </span>
                          </Media>
                        </Media>
                      </td>
                      <td><Moment format="YYYY-MM-DD HH:mm">{match.dateTimeGMT}</Moment></td>
                      <td>{match.squad.toString()}</td>
                      <td>{match.type}</td>
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
          <Row style={{'marginTop': '10px' }}>
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="8">
              <Card className="bg-secondary shadow">
                <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                  <div className="d-flex justify-content-between">
                      <h3 className="">Team Selections</h3>
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
                  <Form onSubmit={this.handleSubmitTeam}>
                    <div className="pl-lg-4">
                      <Row>
                        <Col md="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-teamname"
                            >
                              Team Name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue={this.state.teamDetails['team-1']}
                              id="input-teamname"
                              placeholder="Team Name"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="4">
                        <label
                              className="form-control-label"
                              htmlFor="input-teamname"
                            >
                              Flag
                            </label>
                          <Media className="align-items-center">
                              <a
                                className="avatar rounded-circle mr-3"
                                href="#pablo"
                                onClick={e => e.preventDefault()}
                              >
                                <img
                                  alt="..."
                                  src={this.state.teamDetails['team_1_pic']}
                                />
                              </a>
                            </Media>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-ImageUrl"
                            >
                             Upload Team Flag                            </label>
                            <Input
                            className="my-4"
                              id="input-teamPic"
                              type="file"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-teamname"
                            >
                              Team Name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue= {this.state.teamDetails['team-2']}
                              id="input-teamname"
                              placeholder="team Name"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col md="4">
                        <label
                              className="form-control-label"
                              htmlFor="input-teamname"
                            >
                              Flag
                            </label>
                          <Media className="align-items-center">
                              <a
                                className="avatar rounded-circle mr-3"
                                href="#pablo"
                                onClick={e => e.preventDefault()}
                              >
                                <img
                                  alt="..."
                                  src={this.state.teamDetails['team_2_pic']}
                                />
                              </a>
                            </Media>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-ImageUrl"
                            >
                             Upload Team Flag                            </label>
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
                      <th scope="col">Team</th>
                      <th scope="col">value</th>
                      <th scope="col">cat</th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.squad.map((player,index) => 
                    <tr key={index} onClick={this.selPlayer.bind(this, player)}>
                      <td>{index +1}</td>
                      <td>
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
                              {player.name}
                            </span>
                          </Media>
                        </Media>
                        </td>
                      <td>{player.team}</td>
                      <td>{player.base_price}</td>
                      <td>{player.category}</td>
                      </tr>
                  )}
                  </tbody>
 
                  </Table>
                      </Row>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>

            <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
              <Card className="bg-secondary shadow">
                <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                  <div className="d-flex justify-content-between">
                      <h3 className="">New Player</h3>
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
                    <h6 className="heading-small text-muted mb-4">
                      Player information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue={this.state.selPlayerIs.name}
                              id="input-username"
                              placeholder="Username"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-category"
                            >
                              Category
                            </label>
                            

<Input type="select" name="category" id="exampleSelect">
            <option>Bat</option>
            <option>Bow</option>
            <option>All</option>
            <option>WK</option>
          </Input>
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-teamName"
                            >
                              Team Name
                            </label>
                            <Input
                            className="form-control-alternative"
                              defaultValue={this.state.selPlayerIs.team}
                              id="input-teamName"
                              placeholder="TeamName"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-points"
                            >
                              Points
                            </label>

                            <Input
                              className="form-control-alternative"
                              id="input-points"
                              placeholder="Points"
                              type="text"
                            />
                            {/* <select className="form-control-selectBox">
  <option value="grapefruit">Grapefruit</option>
  <option value="lime">Lime</option>
  <option selected value="coconut">Coconut</option>
  <option value="mango">Mango</option>
</select> */}
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-last-name"
                            >
                              Last name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="Jesse"
                              id="input-last-name"
                              placeholder="Last name"
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
                              htmlFor="input-playerPic"
                            >
                              Select Pic
                            </label>
                            <Input
                            className="my-4"
                              id="input-playerPic"
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
                    Save Player
                  </Button>
                </div>
                          </FormGroup>
                          </Col>
                      </Row>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>

        </Container>
      </>
    );
  }
}

export default showTodaySchedule;
