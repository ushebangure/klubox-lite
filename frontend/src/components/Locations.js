import React from 'react'
import { Button, InputGroup, Input, Toast, ToastBody,
  ListGroupItem, ListGroup, ListGroupItemText,
  Collapse
 } from 'reactstrap'
import { URL } from '../config'

 export class Locations extends React.Component {
   componentDidMount() {
     const token = getToken()
     if (!token) {
       this.props.history.push('/')
     } else {
       this.token = token
     }
     getLocations()
   }

   state = {
     locations: [],
     displaySpinner: false,
     location: '',
     displayToast: false
   }

   getCurrencies = () => {
     this.setState({
       displaySpinner: true
     })

     axios({
       baseUrl: `${URL}/locations`,
       method: 'get',
       headers: { 'token': this.token },
     })
     .then(response => {
       if (response.status === 200 && Array.isArray(response.data.locations)) {
         this.setState({
           locations: response.data.locations,
           displaySpinner: false
         })
       } else {
         this.setState({
           displayToast: `Could not retrieve locations`,
           displaySpinner: false
         })
         setTimeout(() => this.setState({
           this.setState({
             displayToast: ''
           })
         }), 5000)
       }
     })
     .catch(err => {
       this.setState({
         displayToast: `Could not retrieve locations: ${err.message}`
       })
       setTimeout(() => this.setState({
         this.setState({
           displayToast: ''
         })
       }), 5000)
     })

   addLocation = () => {
     if (this.state.location) {
       axios({
         baseUrl: `${URL}/locations`,
         method: 'post',
         headers: { 'token': this.token },
         data: {
           name: this.state.location
         }
       })
       .then (response => {
         if (response.status === 201 && response.data.location) {
           const locs = this.state.locations
           locs.push(this.state.location)
           this.setState({
             locations: locs
           })

           this.setState({
             displayToast: `New location has been added: ${response.data.location}`
           })
           setTimeout(() => this.setState({
             this.setState({
               displayToast: ''
             })
           }), 5000)
         } else {
           this.setState({
             displayToast: `Location could not be added`
           })
           setTimeout(() => this.setState({
             this.setState({
               displayToast: ''
             })
           }), 5000)
         }
       })
       .catch(err => {
         this.setState({
           displayToast: `Currency could not be added: error ${err.message}`
         })
         setTimeout(() => this.setState({
           this.setState({
             displayToast: ''
           })
         }), 5000)
       })
     }
   }

   deleteLocation = e => {
     axios({
       baseUrl: `${URL}/locations/${e.target.name}`,
       method: 'delete',
       headers: { 'token': this.token },
     })
     .then(resp => {
       if (resp.status === 200) {
         this.setState({
           displayToast: `Location '${e.target.name}' has been deleted`,
           locations: this.state.locations.splice(e.target.index)
         })
         setTimeout(() => this.setState({
           this.setState({
             displayToast: ''
           })
         }), 5000)
       } else {
         this.setState({
           displayToast: `Location '${e.target.name}' could not be deleted`
         })
         setTimeout(() => this.setState({
           this.setState({
             displayToast: ''
           })
         }), 5000)
       }
     })
     .catch(err => {
       this.setState({
         displayToast: `Location '${e.target.name}' could not be deleted error: ${err.message}`
       })
       setTimeout(() => this.setState({
         this.setState({
           displayToast: ''
         })
       }), 5000)
     })
   }

   render () {
     return (
       <div>
         <h3>Manage Locations</h3>
         <br/><br/>
         <Collapse isOpen={this.state.displaySpinner}>
           <Spinner style={{width: "4rem", height: "4rem"}} color="primary">
         </Collapse>
         <br/><br/>
         <Toast isOpen={this.state.displayToast}>
           <ToastBody>{this.state.displayToast}</ToastBody>
         </Toast>
         <br/>
         <Collapse isOpen={!this.state.displaySpinner}>
           <ListGroup>
             <ListGroupItem>
               <InputGroup>
                  <Input onChange={(e) => {
                      this.setState({
                        location: e.target.value
                      })
                    }}>
                  <Button onclick={this.addLocation}>add location</Button>
                </InputGroup>
             </ListGroupItem>
             <br/><br/><br/>
             {
               (this.state.locations.length < 1) &&
               <ListGroupItem>
                 <ListGroupItemText color="danger">
                   No locations found
                 </ListGroupItemText>
               </ListGroupItem>
             }
             {
               (this.state.locations > 0) &&
               <ListGroupItem>
                 <tr>
                   <th>Name</th>
                   <th></th>
                 </tr>
               </ListGroupItem>
             }
             {
               (this.state.locations > 0) &&
               this.state.locations.map((location, index) => {
                 if (location) {
                   return (
                     <ListGroupItem>
                       <tr>
                         <td>{location}</td>
                         <td>
                           <Button name={location} index={index} color="danger" onClick={this.deleteLocation}>delete</Button>
                         </td>
                       </tr>
                     </ListGroupItem>
                   )
                 }
               })
             }
           </ListGroup>
         </Collapse>
       </div>
     )
   }
 }
