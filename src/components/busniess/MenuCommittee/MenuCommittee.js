import React, { Component } from "react";
import "./MenuCommittee.less";
import http from "../../../utils/api";
import { Form, message, Icon, Input, Button, Tabs } from "antd";
import NoticeList from "../NoticeList";
import EditNotice from "../EditNotice";
import ApproveList from "../ApproveList";
import ApproveProjectList from "../ApproveProjectList";
const { TabPane } = Tabs;

class MenuCommittee extends Component {
  state = {};

  componentDidMount = () => {};

  render() {
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
        <TabPane tab="申请加入审批" key="1">
          <ApproveList></ApproveList>
        </TabPane>
        <TabPane tab="项目研究审核" key="2">
          <ApproveProjectList></ApproveProjectList>
        </TabPane>
        <TabPane tab="编辑发布通知" key="3">
          <EditNotice></EditNotice>
        </TabPane>
      </Tabs>
    );
  }
}

export default MenuCommittee;
