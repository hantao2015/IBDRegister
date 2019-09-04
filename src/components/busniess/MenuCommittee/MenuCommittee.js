import React, { Component } from "react";
import "./MenuCommittee.less";
import http from "../../../utils/api";
import { Form, message, Icon, Input, Button, Tabs } from "antd";
import NoticeList from "../NoticeList";
import ApplyDataBase from "../ApplyDataBase";
import ApplyProject from "../ApplyProject";
import ActApply from "../ActApply";
const { TabPane } = Tabs;

class MenuCommittee extends Component {
  state = {
  };

  componentDidMount = () => {};

  render() {
    return (
        <Tabs
                defaultActiveKey="2"
                tabBarStyle={{
                  height: "70px",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "50px"
                }}
              >
                <TabPane tab="通知11" key="1">
                 <NoticeList></NoticeList>
                </TabPane>
                <TabPane tab="申请加入数据库" key="2">
                  <ActApply></ActApply>
                </TabPane>
                <TabPane tab="研究项目申请" key="3">
                 <ApplyProject></ApplyProject>
                </TabPane>
                <TabPane tab="申请流程说明" key="4">
                  Content of Tab Pane 3
                </TabPane>
                <TabPane tab="项目公示" key="5">
                  Content of Tab Pane 3
                </TabPane>
                <TabPane tab="文件下载" key="6">
                  Content of Tab Pane 3
                </TabPane>
              </Tabs>
    );
  }
}

export default MenuCommittee;
