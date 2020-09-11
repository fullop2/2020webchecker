import React, {Component} from 'react';
//import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Table } from 'reactstrap';

class ScoreTable extends Component{

  state={
    scores:[]
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.scores !== this.props.scores){
      this.setState({scores: this.props.scores});
    }
  }

  render(){

    const { titles, averages, medians } = this.props;

    let score_data = [];

    if(this.state.scores===undefined){
      score_data = titles.map((_,i)=>{return (<td key={i}></td>);});
    }
    else{
      score_data = this.state.scores.map((score,i)=>{return (<td key={i}>{score}</td>);});
    }

    return (
      <Table>
        <thead>
          <tr>
            <th>일자</th>
          {titles.map((title,i)=>{return (<th key={i}>{title}</th>);})}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>점수</th>
          {
            score_data
          }
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th>평균</th>
            {averages.map((average,i)=>{return (<td key={i}>{average}</td>);})}
          </tr>
          <tr>
            <th>중앙값</th>
            {medians.map((median,i)=>{return (<td key={i}>{median}</td>);})}
          </tr>
        </tfoot>
      </Table>
    )
  }
};

export default ScoreTable;
