import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Input, Container } from 'reactstrap';
import './App.css';
import ScoreTable from './ScoreTable.js';

const {GoogleSpreadsheet } = require('google-spreadsheet');

class DataFrame{
  scores={};
  titles=[];
  averages=[];
  medians=[];
}


class App extends React.Component {

  state={
      quizDataframe : new DataFrame(),
      reviewDataframe : new DataFrame(),
      studentID : ""
  }

  constructor(props){
    super(props);
    this.consoleInput = React.createRef();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount(){
    document.title = "점수 확인";
    this.consoleInput.focus();

    async function loader(documentDirection,type,context){
      const doc = await new GoogleSpreadsheet (documentDirection);
      await doc.useServiceAccountAuth(require('./quickstart-1599744608145-251f214d4b6c.json'));
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];

      await sheet.loadCells('B7:S52');

      const row_loader = row_num=>{
        let list = [];
        let data = '';
        let i = 3;
        for(; (data = sheet.getCell(row_num,i).value) !== null; i++){
          list = [...list, data];
        }

        if(i < 17){
          if(list.length === 0){
            list = [''];
          }
          list = [... list, sheet.getCell(row_num,17).value];
        }

        return list;
      };

      let dataframe = new DataFrame();

      dataframe.titles = row_loader(7);

      for(let row_num = 8; row_num < 50; row_num++){

        const studentID = sheet.getCell(row_num,1).value;
        if(studentID === null) break;

        const current_scores = row_loader(row_num);
        dataframe.scores[studentID] = current_scores;
      }
      dataframe.averages = row_loader(50);
      dataframe.medians = row_loader(51);

      if(type==='quiz')
        context.setState({quizDataframe: dataframe});
      else if(type === 'review')
        context.setState({reviewDataframe: dataframe});
    }

    loader('1ZKTJtiC2Kd8g_2PoEHRSDSJG3GjxrGuS2A5ceMYMprI','quiz',this);
    loader('19bfYAA6ZFV7C2lvF2hsui6hbwX-2ZsT2lApVEJeZJHg','review',this);
  }

  onChange(e){
    this.setState({studentID : e.target.value});
  }

  render(){
    return (
      <Container>
        <div><h1 className="text-center">07 분반 퀴즈 복습 점수</h1></div>
        <Input
            type="number"
            placeholder='type your student ID here'
            ref={e=>{this.consoleInput = e;}}
            value={this.state.currentLine}
            onChange={this.onChange}
            id="studentID"/>
        <div><h2 className='pl-4 pt-4'>퀴즈 점수</h2></div>
          <ScoreTable
            titles={this.state.quizDataframe.titles}
            scores={this.state.quizDataframe.scores[this.state.studentID]}
            averages={this.state.quizDataframe.averages}
            medians={this.state.quizDataframe.medians}/>
        <div><h2 className='pl-4 pt-4'>복습 점수</h2></div>
          <ScoreTable
            titles={this.state.reviewDataframe.titles}
            scores={this.state.reviewDataframe.scores[this.state.studentID]}
            averages={this.state.reviewDataframe.averages}
            medians={this.state.reviewDataframe.medians}/>
        <div><p className='text-center pt-3'>채점 사항에 대한 문의는 튜터에게 해주세요</p>
        </div>
      </Container>
    );
  }
}

export default App;
