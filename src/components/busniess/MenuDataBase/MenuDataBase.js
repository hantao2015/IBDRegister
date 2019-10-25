import React, { Component } from "react";
import "./MenuDataBase.less";
import http from "../../../utils/api";
import { Form, message, Icon, Input, Button, Tabs } from "antd";
import NoticeList from "../NoticeList";
import ApplyDataBase from "../ApplyDataBase";
import ApplyProject from "../ApplyProject";
import ActApply from "../ActApply";
import ShowProject from "../ShowProject";
import DownFile from "../DownFile";
const { TabPane } = Tabs;

class MenuDataBase extends Component {
  state = {
    isUpdate: false //是否更新项目申请
  };

  componentDidMount = () => {};
  onUpdate = () => {
    this.setState({
      isUpdate: true
    });
  };

  render() {
    const { isUpdate } = this.state;
    return (
      <Tabs
        defaultActiveKey="1"
        tabBarStyle={{
          height: "70px",
          display: "flex",
          alignItems: "center",
          paddingLeft: "50px"
        }}
      >
        <TabPane tab="通知" key="1">
          <NoticeList></NoticeList>
        </TabPane>
        <TabPane tab="申请加入数据库" key="2">
          <ActApply></ActApply>
        </TabPane>
        <TabPane tab="研究项目申请" key="3">
          <ApplyProject isUpdate={isUpdate}></ApplyProject>
        </TabPane>
        <TabPane tab="项目公示" key="4">
          <ShowProject onUpdate={this.onUpdate}></ShowProject>
        </TabPane>
        <TabPane tab="文件下载" key="5">
          <DownFile></DownFile>
        </TabPane>
      </Tabs>
    );
  }
}

export default MenuDataBase;
