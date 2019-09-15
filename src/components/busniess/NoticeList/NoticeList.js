import React, { Component } from "react";
import "./NoticeList.less";
import { Collapse, Icon, Alert, Empty, Button, Spin } from "antd";
import http from "../../../utils/api";
const { Panel } = Collapse;
const noticeId = "620317621824";

class NoticeList extends Component {
  state = {
    collapsed: false,
    imageUrl: "",
    userInfo: {},
    currentNotice: [],
    historyNotice: [],
    showSpin:false
  };
  componentDidMount = async () => {
    let res;
    this.setState({
      showSpin:true
    })
    try {
      res = await http().getTable({
        resid: noticeId
      });
      const [current, ...history] = res.data.data;
      this.setState({
        currentNotice: current,
        historyNotice: history
      });
    } catch (error) {}
    this.setState({
      showSpin:false
    })
  };
  render() {
    const customPanelStyle = {
      background: "#f7f7f7",
      borderRadius: 4,
      marginBottom: 24,
      border: 0,
      overflow: "hidden"
    };
    const { currentNotice, historyNotice,showSpin } = this.state;
    return (
      <div className="noticeList">
        <Spin spinning={showSpin}>
        <h2>最新通知</h2>
        <Alert
          message={currentNotice.title}
          description={<div><span>{currentNotice.content}</span><span className='noticeList-time'>{currentNotice.publishTime}</span></div>}
          type="info"
          showIcon
          // closeText="Close"
        />
        <div className="noticeList-line"> </div>
        <h3>历史通知</h3>
        {historyNotice.length > 0 ? (
          <Collapse
            bordered={false}
            className='noticeList-Collapse'
            defaultActiveKey={["0"]}
            expandIcon={({ isActive }) => (
              <Icon type="caret-right" rotate={isActive ? 90 : 0} />
            )}
          >
            {historyNotice.map((item,index) => {
              return (
                <Panel header={<div><span>{item.title}</span><span className='noticeList-time'>{item.publishTime}</span></div>} key={index} style={customPanelStyle}>
                  <p>{item.content}</p>
                </Panel>
              );
            })}
          </Collapse>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
        </Spin>
      </div>
    );
  }
}

export default NoticeList;
