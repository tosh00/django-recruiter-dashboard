import React from 'react';
import ReactDOM from 'react-dom';
import CustomNavbar from "./components/Nav.js";
import { Bar, Pie } from "react-chartjs-2";
import { Row, Col, Button } from 'react-bootstrap';




let jo = document.getElementById("data").value;
let recEl = JSON.parse(document.getElementById("recruters").value)
recEl.map((item) => {
    item["name"] = item.first_name + " " + item.last_name;
    delete item.first_name;
    delete item.last_name;
});
console.log(recEl);

let people = JSON.parse(jo);
let skillsList = [];
let candidates = [];
let juryList = [];
const multiplier = 1;

console.log(people);

people.map((item) => {
    item.skills = JSON.parse(item.skills);
});

people.map((item, i) => {
    recEl.map((item2, j) => {

        people[i].skills[item2.name] = people[i].skills[item2.id];
        console.log(item2, !people[i].skills[item2.name]);
        if (!people[i].skills[item2.name]) {
            delete recEl[j];
            delete people[i].skills[item2.name];
            people.map((peopleObj, l) => {
                delete people[l].skills[item2.name];
            });
        }
        delete people[i].skills[item2.id];
    });
});


for (let i = 0; i < people.length; i++) {
    console.log(`loop ${i}`);
    if (people[i].skills) {
        
        let temp = Object.getOwnPropertyNames(people[i].skills)
        juryList = juryList.concat(temp);

        let x;
        for (x in people[i].skills) {

            skillsList = skillsList.concat(Object.getOwnPropertyNames(people[i].skills[x]));
            let y;
            for (y in people[i].skills[x]) {
                people[i].skills[x][y] = parseInt(people[i].skills[x][y])
            }

        }

        people[i] = { ...people[i], ...people[i].skills };
        delete people[i].skills;

    }
    else {
        people[i] = undefined;
    }
}

let tableOfPeople = [];
let i = 0;
people.map((item) => {
    if (item) {
        tableOfPeople[i] = item;
        i++;
    }
});
people = tableOfPeople;

people.map((item, i) => {
    item.name = `${item.first_name.trim()} ${item.last_name.trim()}`;
    delete item.first_name;
    delete item.last_name;
    candidates[i] = item.name;
});



juryList = Array.from(new Set(juryList));
skillsList = Array.from(new Set(skillsList));

people.map((item) => {
    item["Average Rates"] = {};
    skillsList.map((item2) => {
        item["Average Rates"][item2] = handleCalculateAverage(item, item2);
    });
});

function handleCalculateAverage(person, skill) {
    let average = 0;
    juryList.map((item2) => {
        average += person[item2][skill]
    });

    return ((Math.round((average / juryList.length) * 100)) / 100);
}

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.handleChangeSkill = this.handleChangeSkill.bind(this);
        this.handleChangeRecruter = this.handleChangeRecruter.bind(this);
        this.handleMarkCandidate = this.handleMarkCandidate.bind(this);
        this.handleCreateCurrentRates = this.handleCreateCurrentRates.bind(this);
        this.handleSetAverage = this.handleSetAverage.bind(this);
        this.handleSkillsWeight = this.handleSkillsWeight.bind(this);
        this.handleResetSkillsWeight = this.handleResetSkillsWeight.bind(this);
        this.handleCheckCandidate = this.handleCheckCandidate.bind(this);

        this.state = {
            fullAverageRates: candidates.map((item, i) => {
                let table = skillsList.map((item2) => people[i]["Average Rates"][item2] * multiplier * 1);
                let sum = 0;
                table.map((item) => {
                    sum += item;
                })
                const number = 6;
                sum = (Math.round((sum / number * 100))) / 10
                return sum;
            }),
            skillsWeight: skillsList.map(() => 1),
            currentJury: "Average Rates",
            currentSkill: skillsList[0],
            currentCandidate: candidates[0],
            currentCandidates: candidates,
            currentRates: this.handleCreateCurrentRates(candidates, "Average Rates", skillsList[0]),
            dataBar2: {
                labels: juryList,
                datasets: [
                    {
                        label: skillsList[0],
                        data: juryList.map((item) => people[0][item][skillsList[0]]),
                        backgroundColor: [
                            "rgba(255, 134,159,0.4)",
                            "rgba(98,  182, 239,0.4)",
                            "rgba(255, 218, 128,0.4)",
                            "rgba(113, 205, 205,0.4)",
                            "rgba(170, 128, 252,0.4)",
                            "rgba(255, 177, 101,0.4)"
                        ],
                        borderWidth: 2,
                        borderColor: [
                            "rgba(255, 134, 159, 1)",
                            "rgba(98,  182, 239, 1)",
                            "rgba(255, 218, 128, 1)",
                            "rgba(113, 205, 205, 1)",
                            "rgba(170, 128, 252, 1)",
                            "rgba(255, 177, 101, 1)"
                        ]
                    }
                ]
            },
            dataBar: {
                labels: candidates,
                datasets: [
                    {
                        label: skillsList[0],
                        data: this.handleCreateCurrentRates(candidates, "Average Rates", skillsList[0]),
                        backgroundColor: [
                            "rgba(255, 134,159,0.4)",
                            "rgba(98,  182, 239,0.4)",
                            "rgba(255, 218, 128,0.4)",
                            "rgba(113, 205, 205,0.4)",
                            "rgba(170, 128, 252,0.4)",
                            "rgba(255, 177, 101,0.4)"
                        ],
                        borderWidth: 2,
                        borderColor: [
                            "rgba(255, 134, 159, 1)",
                            "rgba(98,  182, 239, 1)",
                            "rgba(255, 218, 128, 1)",
                            "rgba(113, 205, 205, 1)",
                            "rgba(170, 128, 252, 1)",
                            "rgba(255, 177, 101, 1)"
                        ]
                    }
                ]
            },
            barChartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [
                        {
                            barPercentage: 1,
                            gridLines: {
                                display: true,
                                color: "rgba(255, 255, 255, 0.2)"
                            }
                        }
                    ],
                    yAxes: [
                        {
                            gridLines: {
                                display: true,
                                color: "rgba(255, 255, 255, 0.2)"
                            },
                            ticks: {
                                beginAtZero: true
                            }
                        }
                    ]
                }
            },
            dataPies: candidates.map((item, i) => {
                const dataPie = {
                    labels: skillsList,
                    datasets: [
                        {
                            data: skillsList.map((item2) => people[i]["Average Rates"][item2] * multiplier * 1),
                            backgroundColor: [
                                "#F7464A",
                                "#46BFBD",
                                "#FDB45C",
                                "#949FB1",
                                "#4D5360",
                                "#AC64AD"
                            ],
                            hoverBackgroundColor: [
                                "#FF5A5E",
                                "#5AD3D1",
                                "#FFC870",
                                "#A8B3C5",
                                "#616774",
                                "#DA92DB"
                            ]
                        }
                    ]
                }
                return dataPie;
            })
        }
    }

    handleCheckCandidate(index) {
        console.log(people[index]);
        this.setState((prev) => {
            return {
                currentCandidate: people[index].name,
                dataBar2: {
                    labels: juryList,
                    datasets: [
                        {
                            label: prev.currentSkill,
                            data: juryList.map((item) => people[index][item][prev.currentSkill]),
                            backgroundColor: [
                                "rgba(255, 134,159,0.4)",
                                "rgba(98,  182, 239,0.4)",
                                "rgba(255, 218, 128,0.4)",
                                "rgba(113, 205, 205,0.4)",
                                "rgba(170, 128, 252,0.4)",
                                "rgba(255, 177, 101,0.4)"
                            ],
                            borderWidth: 2,
                            borderColor: [
                                "rgba(255, 134, 159, 1)",
                                "rgba(98,  182, 239, 1)",
                                "rgba(255, 218, 128, 1)",
                                "rgba(113, 205, 205, 1)",
                                "rgba(170, 128, 252, 1)",
                                "rgba(255, 177, 101, 1)"
                            ]
                        }
                    ]
                }
            };
        });
    }

    handleResetSkillsWeight() {
        this.setState(() => {
            return {
                skillsWeight: skillsList.map(() => 1),
                dataPies: candidates.map((item, i) => {
                    const dataPie = {
                        labels: skillsList,
                        datasets: [
                            {
                                data: skillsList.map((item2, j) => people[i]["Average Rates"][item2] * multiplier * 1),
                                backgroundColor: [
                                    "#F7464A",
                                    "#46BFBD",
                                    "#FDB45C",
                                    "#949FB1",
                                    "#4D5360",
                                    "#AC64AD"
                                ],
                                hoverBackgroundColor: [
                                    "#FF5A5E",
                                    "#5AD3D1",
                                    "#FFC870",
                                    "#A8B3C5",
                                    "#616774",
                                    "#DA92DB"
                                ]
                            }
                        ]
                    }
                    return dataPie;
                }),
                fullAverageRates: candidates.map((item, i) => {
                    let table = skillsList.map((item2) => people[i]["Average Rates"][item2] * multiplier * 1);
                    let sum = 0;
                    table.map((item) => {
                        sum += item;
                    })
                    const number = 6;
                    sum = (Math.round((sum / number * 100))) / 10
                    return sum;
                })
            };
        })
    }

    handleSkillsWeight(weight, index) {
        let newTable = this.state.skillsWeight.map(x => x);
        newTable[index] = weight;
        this.setState(() => {
            return {
                skillsWeight: newTable,
                dataPies: candidates.map((item, i) => {
                    const dataPie = {
                        labels: skillsList,
                        datasets: [
                            {
                                data: skillsList.map((item2, j) => people[i]["Average Rates"][item2] * multiplier * newTable[j]),
                                backgroundColor: [
                                    "#F7464A",
                                    "#46BFBD",
                                    "#FDB45C",
                                    "#949FB1",
                                    "#4D5360",
                                    "#AC64AD"
                                ],
                                hoverBackgroundColor: [
                                    "#FF5A5E",
                                    "#5AD3D1",
                                    "#FFC870",
                                    "#A8B3C5",
                                    "#616774",
                                    "#DA92DB"
                                ]
                            }
                        ]
                    }
                    return dataPie;
                }),
                fullAverageRates: candidates.map((item, i) => {
                    let table = skillsList.map((item2, j) => people[i]["Average Rates"][item2] * multiplier * newTable[j]);
                    let sum = 0;

                    table.map((item) => {
                        sum += item;
                    });

                    let number = 0;
                    newTable.map((item) => {
                        number += item;
                    });

                    sum = (Math.round((sum / number * 100))) / 10
                    return sum;
                })
            };
        });
    }

    handleCreateCurrentRates(currentCandidates, currentJury, currentSkill) {
        let table = [];

        currentCandidates.map((item) => {
            let canItem = item;
            people.map((item2) => {
                if (item2.name == canItem) {
                    table.push(parseFloat(item2[currentJury][currentSkill]) * multiplier);
                }
            });
        });
        return table;
    }

    handleChangeSkill(skill) {

        this.setState((prev) => {
            let table = [];
            people.map((item) => {
                if (item.name == prev.currentCandidate) {
                    table = juryList.map((item2) => item[item2][skill]);
                }
            });
            return {
                currentSkill: skill,
                currentRates: this.handleCreateCurrentRates(prev.currentCandidates, prev.currentJury, skill),
                dataBar: {
                    labels: prev.currentCandidates,
                    datasets: [
                        {
                            label: skill,
                            data: this.handleCreateCurrentRates(prev.currentCandidates, prev.currentJury, skill),
                            backgroundColor: [
                                "rgba(255, 134,159,0.4)",
                                "rgba(98,  182, 239,0.4)",
                                "rgba(255, 218, 128,0.4)",
                                "rgba(113, 205, 205,0.4)",
                                "rgba(170, 128, 252,0.4)",
                                "rgba(255, 177, 101,0.4)"
                            ],
                            borderWidth: 2,
                            borderColor: [
                                "rgba(255, 134, 159, 1)",
                                "rgba(98,  182, 239, 1)",
                                "rgba(255, 218, 128, 1)",
                                "rgba(113, 205, 205, 1)",
                                "rgba(170, 128, 252, 1)",
                                "rgba(255, 177, 101, 1)"
                            ]
                        }
                    ]
                },
                dataBar2: {
                    labels: juryList,
                    datasets: [
                        {
                            label: skill,
                            data: table,
                            backgroundColor: [
                                "rgba(255, 134,159,0.4)",
                                "rgba(98,  182, 239,0.4)",
                                "rgba(255, 218, 128,0.4)",
                                "rgba(113, 205, 205,0.4)",
                                "rgba(170, 128, 252,0.4)",
                                "rgba(255, 177, 101,0.4)"
                            ],
                            borderWidth: 2,
                            borderColor: [
                                "rgba(255, 134, 159, 1)",
                                "rgba(98,  182, 239, 1)",
                                "rgba(255, 218, 128, 1)",
                                "rgba(113, 205, 205, 1)",
                                "rgba(170, 128, 252, 1)",
                                "rgba(255, 177, 101, 1)"
                            ]
                        }
                    ]
                }
            };
        })
    }
    handleChangeRecruter(recruter) {
        this.setState((prev) => {
            return {
                currentJury: recruter,
                currentRates: this.handleCreateCurrentRates(prev.currentCandidates, recruter, prev.currentSkill),
                dataBar: {
                    labels: prev.currentCandidates,
                    datasets: [
                        {
                            label: prev.currentSkill,
                            data: this.handleCreateCurrentRates(prev.currentCandidates, recruter, prev.currentSkill),
                            backgroundColor: [
                                "rgba(255, 134,159,0.4)",
                                "rgba(98,  182, 239,0.4)",
                                "rgba(255, 218, 128,0.4)",
                                "rgba(113, 205, 205,0.4)",
                                "rgba(170, 128, 252,0.4)",
                                "rgba(255, 177, 101,0.4)"
                            ],
                            borderWidth: 2,
                            borderColor: [
                                "rgba(255, 134, 159, 1)",
                                "rgba(98,  182, 239, 1)",
                                "rgba(255, 218, 128, 1)",
                                "rgba(113, 205, 205, 1)",
                                "rgba(170, 128, 252, 1)",
                                "rgba(255, 177, 101, 1)"
                            ]
                        }
                    ]
                }
            };
        });
    }


    handleMarkCandidate(candidate) {
        if (this.state.currentCandidates.indexOf(candidate) > -1) {
            let newTable = [];
            let i = 0;
            this.state.currentCandidates.map((item) => {
                if (item != candidate) {
                    newTable[i] = item;
                    i++;
                }
            });

            this.setState((prev) => {
                return {
                    currentCandidates: newTable,
                    currentRates: this.handleCreateCurrentRates(newTable, this.state.currentJury, this.state.currentSkill),
                    dataBar: {
                        labels: newTable,
                        datasets: [
                            {
                                label: prev.currentSkill,
                                data: this.handleCreateCurrentRates(newTable, prev.currentJury, prev.currentSkill),
                                backgroundColor: [
                                    "rgba(255, 134,159,0.4)",
                                    "rgba(98,  182, 239,0.4)",
                                    "rgba(255, 218, 128,0.4)",
                                    "rgba(113, 205, 205,0.4)",
                                    "rgba(170, 128, 252,0.4)",
                                    "rgba(255, 177, 101,0.4)"
                                ],
                                borderWidth: 2,
                                borderColor: [
                                    "rgba(255, 134, 159, 1)",
                                    "rgba(98,  182, 239, 1)",
                                    "rgba(255, 218, 128, 1)",
                                    "rgba(113, 205, 205, 1)",
                                    "rgba(170, 128, 252, 1)",
                                    "rgba(255, 177, 101, 1)"
                                ]
                            }
                        ]
                    }
                };
            });
        }
        else {
            let currTable = this.state.currentCandidates.concat([candidate]);

            this.setState((prev) => {
                return {
                    currentCandidates: prev.currentCandidates.concat([candidate]),
                    currentRates: this.handleCreateCurrentRates(currTable, this.state.currentJury, this.state.currentSkill),
                    dataBar: {
                        labels: prev.currentCandidates.concat([candidate]),
                        datasets: [
                            {
                                label: prev.currentSkill,
                                data: this.handleCreateCurrentRates(prev.currentCandidates.concat([candidate]), prev.currentJury, prev.currentSkill),
                                backgroundColor: [
                                    "rgba(255, 134,159,0.4)",
                                    "rgba(98,  182, 239,0.4)",
                                    "rgba(255, 218, 128,0.4)",
                                    "rgba(113, 205, 205,0.4)",
                                    "rgba(170, 128, 252,0.4)",
                                    "rgba(255, 177, 101,0.4)"
                                ],
                                borderWidth: 2,
                                borderColor: [
                                    "rgba(255, 134, 159, 1)",
                                    "rgba(98,  182, 239, 1)",
                                    "rgba(255, 218, 128, 1)",
                                    "rgba(113, 205, 205, 1)",
                                    "rgba(170, 128, 252, 1)",
                                    "rgba(255, 177, 101, 1)"
                                ]
                            }
                        ]
                    }
                };
            });
        } this.props.currentRates
    }
    handleSetAverage() {
        this.setState((prev) => {
            return {
                currentJury: "Average Rates",
                currentRates: this.handleCreateCurrentRates(prev.currentCandidates, "Average Rates", prev.currentSkill),
                dataBar: {
                    labels: prev.currentCandidates,
                    datasets: [
                        {
                            label: prev.currentSkill,
                            data: this.handleCreateCurrentRates(prev.currentCandidates, "Average Rates", prev.currentSkill),
                            backgroundColor: [
                                "rgba(255, 134,159,0.4)",
                                "rgba(98,  182, 239,0.4)",
                                "rgba(255, 218, 128,0.4)",
                                "rgba(113, 205, 205,0.4)",
                                "rgba(170, 128, 252,0.4)",
                                "rgba(255, 177, 101,0.4)"
                            ],
                            borderWidth: 2,
                            borderColor: [
                                "rgba(255, 134, 159, 1)",
                                "rgba(98,  182, 239, 1)",
                                "rgba(255, 218, 128, 1)",
                                "rgba(113, 205, 205, 1)",
                                "rgba(170, 128, 252, 1)",
                                "rgba(255, 177, 101, 1)"
                            ]
                        }
                    ]
                }
            };
        });
    }
    render() {
        return (
            <div>
                <div className="dashboard">
                    <Row>
                        <Col md={5}>
                            <CustomChart
                                className={`custom-chart`}
                                currentJury={this.state.currentJury}
                                dataBar={this.state.dataBar}
                                barChartOptions={this.state.barChartOptions}
                            />
                        </Col>
                        <Col>
                            <CustomChart
                                className={`custom-chart`}
                                currentJury={this.state.currentCandidate}
                                dataBar={this.state.dataBar2}
                                barChartOptions={this.state.barChartOptions}
                            />
                        </Col>
                        <Col md={3}>
                            <Row>
                                <Col>
                                    <Jury
                                        className="jury"
                                        currentJury={this.state.currentJury}
                                        handleChangeRecruter={this.handleChangeRecruter}
                                        handleSetAverage={this.handleSetAverage}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <People
                                        className="people"
                                        currentCandidate={this.state.currentCandidate}
                                        currentSkill={this.state.currentSkill}
                                        currentJury={this.state.currentJury}
                                        handleMarkCandidate={this.handleMarkCandidate}
                                        currentCandidates={this.state.currentCandidates}
                                        skillsWeight={this.state.skillsWeight}
                                        dataPies={this.state.dataPies}
                                        fullAverageRates={this.state.fullAverageRates}
                                        handleCheckCandidate={this.handleCheckCandidate}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Skills
                                        className="skills"
                                        currentSkill={this.state.currentSkill}
                                        handleChangeSkill={this.handleChangeSkill}
                                        handleSkillsWeight={this.handleSkillsWeight}
                                        skillsWeight={this.state.skillsWeight}
                                        handleResetSkillsWeight={this.handleResetSkillsWeight}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>



        );
    }
}

class CustomChart extends React.Component {
    constructor(props) {
        super(props);
        this.index = 0;
    }
    render() {
        return (
            <div className={`${this.props.className} position-fixed`}>
                <BarChart
                    currentJury={this.props.currentJury}
                    dataBar={this.props.dataBar}
                    barChartOptions={this.props.barChartOptions}
                />
            </div>
        );
    }
}

class BarChart extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="chart-container">
                <h3 className="mt-5">{this.props.currentJury}</h3>
                <Bar data={this.props.dataBar} options={this.props.barChartOptions} />
            </div>
        );
    }
}

class PieChart extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Pie data={this.props.dataPie} options={{ responsive: true }} />
            </div>


        );
    }
}

class Skills extends React.Component {
    constructor(props) {
        super(props);
        this.handleChangeSkill = this.handleChangeSkill.bind(this);
        this.handleSkillsWeight = this.handleSkillsWeight.bind(this);
        this.state = {
        };
    }
    handleChangeSkill(skill) {
        this.props.handleChangeSkill(skill);
    }
    handleSkillsWeight(weight, skillName) {
        this.props.handleSkillsWeight(weight, skillName);
    }

    render() {
        return (
            <div className={this.props.className}>
                <h2 className="custom-title">
                    Skills
                    <Button
                        variant="warning"
                        className="box-shadow-1 float-right mr-3"
                        onClick={this.props.handleResetSkillsWeight}
                    >
                        Reset
                    </Button>
                </h2>
                <ul className="personSkills">
                    {skillsList.map((item, i) =>
                        <Skill
                            key={item + i}
                            skillName={item}
                            handleChangeSkill={this.handleChangeSkill}
                            isActive={this.props.currentSkill == item ? "active" : ""}
                            weight={this.props.skillsWeight[i]}
                            handleSkillsWeight={this.handleSkillsWeight}
                            index={i}
                        />)
                    }
                </ul>
            </div>
        );
    }
}

class Skill extends React.Component {
    constructor(props) {
        super(props);
        this.handleChangeSkill = this.handleChangeSkill.bind(this);
        this.handleAddWeight = this.handleAddWeight.bind(this);
        this.handleMinusWeight = this.handleMinusWeight.bind(this);
        this.state = {
        }
    }
    handleChangeSkill() {
        this.props.handleChangeSkill(this.props.skillName);
    }
    handleAddWeight() {
        if (this.props.weight < 50) {
            this.props.handleSkillsWeight(this.props.weight + 1, this.props.index);
        }

    }
    handleMinusWeight() {
        if (this.props.weight > 1) {
            this.props.handleSkillsWeight(this.props.weight - 1, this.props.index);
        }
    }
    render() {
        return (
            <li
                name="personSkill"
                className={`person-skill ${this.props.isActive}`}
                onClick={this.handleChangeSkill}
            >
                <span>
                    {this.props.skillName}
                </span>

                <span className="float-right wieghts">
                    <span onClick={this.handleMinusWeight}>
                        <i className="fas fa-minus-square"></i>
                    </span>
                    <span className={`ml-2`}>
                        {this.props.weight}
                    </span>
                    <span onClick={this.handleAddWeight}>
                        <i className="fas fa-plus-square"></i>
                    </span>
                </span>
            </li>
        );
    }
}

class Jury extends React.Component {
    constructor(props) {
        super(props);
        this.handleChangeRecruter = this.handleChangeRecruter.bind(this);
    }
    handleChangeRecruter(recruter) {
        this.props.handleChangeRecruter(recruter);
    }
    render() {
        return (
            <div className={this.props.className}>
                <h2 className="custom-title">
                    Jury
                    <Button
                        variant="warning"
                        className="box-shadow-1 float-right mr-3"
                        onClick={this.props.handleSetAverage}
                    >
                        Average
                    </Button>
                </h2>
                <ul>
                    {juryList.map((item, i) =>
                        <Recruter
                            key={`${item + i}`}
                            juryName={item}
                            isActive={item == this.props.currentJury ? "active" : ""}
                            handleChangeRecruter={this.handleChangeRecruter}
                        />
                    )}
                </ul>
            </div>
        );
    }
}

class Recruter extends React.Component {
    constructor(props) {
        super(props);
        this.handleChangeRecruter = this.handleChangeRecruter.bind(this);
    }
    handleChangeRecruter() {
        this.props.handleChangeRecruter(this.props.juryName)
    }
    render() {
        return (
            <li
                className={`recruter ${this.props.isActive}`}
                onClick={this.handleChangeRecruter}
            >
                {this.props.juryName}
            </li>
        );
    }
}

class People extends React.Component {
    constructor(props) {
        super(props);
        this.handleMarkCandidate = this.handleMarkCandidate.bind(this);
    }
    handleMarkCandidate(candidate) {
        this.props.handleMarkCandidate(candidate);
    }
    render() {
        return (
            <div className={this.props.className}>
                <h2 className="custom-title">Candidates</h2>
                <ul>
                    {people.map((item, i) =>
                        <Person
                            key={`person${i}`}
                            ID={i}
                            personId={item.id}
                            personName={item.name}
                            currentCandidate={this.props.currentCandidate}
                            currentRate={item[this.props.currentJury][this.props.currentSkill]}
                            currentJury={this.props.currentJury}
                            handleMarkCandidate={this.handleMarkCandidate}
                            isActive={this.props.currentCandidates.indexOf(item.name) > -1 ? "active" : ""}
                            skillsWeight={this.props.skillsWeight}
                            dataPie={this.props.dataPies[i]}
                            fullAverageRate={this.props.fullAverageRates[i]}
                            handleCheckCandidate={this.props.handleCheckCandidate}
                        />
                    )}
                </ul>
            </div>
        );
    }
}

class Person extends React.Component {
    constructor(props) {
        super(props);
        this.handleMarkCandidate = this.handleMarkCandidate.bind(this);
        this.handleShowDetails = this.handleShowDetails.bind(this);
        this.handleCheckCandidate = this.handleCheckCandidate.bind(this);
        this.state = {
            drop: false,
            style: {
                width: "50%"
            }
        }
    }
    handleMarkCandidate() {
        this.props.handleMarkCandidate(this.props.personName);
    }
    handleShowDetails() {
        this.setState((prev) => {
            return {
                drop: !prev.drop
            };
        });
    }
    handleCheckCandidate() {
        this.props.handleCheckCandidate(this.props.ID);
    }
    render() {
        return (
            <li className="person">
                <Row>
                    <Col lg={11}>
                        <Row>
                            <Col>
                                <span className={`personId ${this.props.isActive}`} onClick={this.handleMarkCandidate}><span></span></span>
                                <span className="personName ml-3">{this.props.personName}</span>
                                <span
                                    className={`check box-shadow-1`}
                                    onClick={this.handleCheckCandidate}
                                >check</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="hole-rate">
                                    <div style={{ width: `${this.props.fullAverageRate}%` }}></div>
                                </div>
                                <span className="text">{`${this.props.fullAverageRate}%`}</span>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={1}>
                        <span className="personRate">
                            <span
                                className={`drop-down`}
                                onClick={this.handleShowDetails}
                            >
                                {this.state.drop ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
                            </span>
                        </span>
                    </Col>
                </Row>
                <Row mt={4} className="show-content">
                    <Col>
                        <PieChart
                            personId={this.props.personId}
                            skillsWeight={this.props.skillsWeight}
                            dataPie={this.props.dataPie}
                        />
                    </Col>
                </Row>

            </li>
        );
    }
}

// ========================================

ReactDOM.render(
    <Dashboard />,
    document.getElementById('root')
);