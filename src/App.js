import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Input, Container } from 'reactstrap';
import './App.css';
import ScoreTable from './ScoreTable.js';

const {GoogleSpreadsheet } = require('google-spreadsheet');


class App extends React.Component {

  state={
      scores:{},
      titles:[],
      averages:[],
      medians:[]
  }

  constructor(props){
    super(props);
    this.consoleInput = React.createRef();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount(){
    document.title = "점수 확인";
    this.consoleInput.focus();

    const doc = new GoogleSpreadsheet ('1ZKTJtiC2Kd8g_2PoEHRSDSJG3GjxrGuS2A5ceMYMprI');


    (async ()=>{

      await doc.useServiceAccountAuth(require('./quickstart-1599744608145-251f214d4b6c.json'));
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];

      await sheet.loadCells('B7:S52');

      const row_loader = row_num=>{
        let list = [];
        let data = '';
        for(let i = 3; (data = sheet.getCell(row_num,i).value) !== null; i++){
          list = [...list, data];
        }
        return list;
      };

      this.setState({titles:row_loader(7)});

      for(let row_num = 8; row_num < 50; row_num++){

        const studentID = sheet.getCell(row_num,1).value;
        if(studentID === null) break;

        const current_scores = row_loader(row_num);
        let scores = this.state.scores;
        scores[studentID] = current_scores;
        this.setState({scores:scores});
      }

      this.setState({averages:row_loader(50)});
      this.setState({medians:row_loader(51)});

    })();

  }

  onChange(e){
    this.setState({studentID : e.target.value});
  }

  render(){
    return (
      <Container>
        <div><h1 className="text-center">07 분반 퀴즈 점수</h1></div>
        <Input
            type="number"
            placeholder='type your student ID here'
            ref={e=>{this.consoleInput = e;}}
            value={this.state.currentLine}
            onChange={this.onChange}
            id="studentID"/>
          <ScoreTable
            titles={this.state.titles}
            scores={this.state.scores[this.state.studentID]}
            averages={this.state.averages}
            medians={this.state.medians}/>
      </Container>
    );
  }
}

export default App;
