import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row, CardBody, CardTitle, CardSubtitle, Badge, CardHeader, Button } from "shards-react";
import WeeklyOverview from '../components/WeeklyOverview';
import TimerButtons from '../components/TimerButtons';
import Timetable from '../components/Timetable';
import RecommendedTasks from '../components/RecommendedTasks'
import axios from 'axios';

function Dashboard (props) {
    const daysOfWeek = ['mon','tues','wed','thurs','fri', 'weekend'] //placeholder
    const tags = ['ESC301', 'AER372', 'CSC384', 'ECE353', 'MIE438', 'ROB313'] //placeholder
    let [isNew, setIsNew] = useState(false)
    let [tdyCourses, setTdyCourses] = useState([])

    useEffect(() => {
        async function authUser() {
            if(!window.localStorage.isLoggedIn || !window.localStorage.user){
                props.history.push('/login')
                window.location.reload()
            } else {
                const lettersOfWeek = ['M', 'T', 'W', 'H', 'F']
                // console.log(window.localStorage)
                let res = await axios.get(`/users/${window.localStorage.user}/current`)
                if(res.data.isNewUser) {
                    setIsNew(true)
                } else {
                    const tt = res.data.courses.map(c => {return {timetable: c.timetable, name: c.course_name}})
                    let todayCourses = []
                    const today = new Date()
                    const dow = lettersOfWeek[today.getDay()]
                    console.log(dow)
                    tt.forEach(t => {
                        if(t.timetable.includes(dow)){
                            const hh = t.timetable.slice(t.timetable.indexOf(dow) + 1,t.timetable.indexOf(dow) + 6)
                            todayCourses.push({
                                time: hh,
                                amt: parseInt(hh.split('-')[1]) - parseInt(hh.split('-')[0]),
                                name: t.name
                            })
                        }
                    })
                    setTdyCourses(todayCourses)
                }
            }
        }
        authUser()
    }, [props.history])
    
    return(
        <Container>
                <h1 style={{textAlign: 'center', color: '#5784BA', justifyContent: 'center'}}>Dashboard</h1>
            { !isNew &&
            <>
                <Row>
                    <WeeklyOverview days={daysOfWeek} tags={tags}/>
                </Row>
                <Row>
                    <Col lg={4}>
                        <Timetable schedule={tdyCourses}/>
                    </Col>
                    <Col lg={4}>
                        <br></br>
                        <RecommendedTasks/>
                    </Col>
                    <Col lg={4}>
                        <br></br>
                        <br></br>
                        <h4 style={{textAlign: 'center', color: '#5784BA'}}>Track your study time!</h4>
                        <h5 style={{textAlign: 'center', color: '#5784BA'}}> stop work | start work | take break</h5>
                        <div style={{display:'flex',alignItems:'center', justifyContent: 'center'}}>
                            <TimerButtons/>
                        </div>
                    </Col>
                    
                </Row>
            </>}
            {isNew && 
                <Row>
                    <h5>You don't have any data uploaded yet</h5>
                    <Button theme="light"><a href="/courses">Upload Courses</a></Button>
                </Row>
            }
        </Container>
    )
}

export default Dashboard;
