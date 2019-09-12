import React, { Component } from "react";
import { Modal, Tag, Button, Table, message, Spin, Form, Input } from "antd";
import "./ShowProject.less";
import http from "../../../utils/api";
const applyProjectId = "620475440053";
const suggestId = "621432069832";
const { TextArea } = Input;

class ShowProject extends React.Component {
  state = {
    data: [{}],
    page: "listPage",
    spin: false,
    record: {},
    visible: false
  };
  componentDidMount = async () => {
    await this.getData();
  };
  componentWillUnmount() {
    // 卸载异步操作设置状态
    this.setState = (state, callback) => {
      return;
    };
  }
  onCheck = record => {
    this.setState({
      page: "checkPage",
      record
    });
  };
  onBack = () => {
    this.setState({
      page: "listPage"
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  onSuggest = () => {
    this.setState({
      visible: true
    });
  };
  submitSuggest = async e => {
    const { record } = this.state;
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      let res;
      let data = [
        {
          suggest: values.suggest,
          projectId: record.REC_ID
        }
      ];
      try {
        res = await http().addRecords({
          resid: suggestId,
          data
        });
        if (res.data.Error === 0) {
          message.success("添加成功");
        }
      } catch (error) {
        message.error(error.message);
      }
      this.setState({
        visible: false
      });
    });
  };
  getData = async () => {
    this.setState({
      spin: true
    });
    let res;
    try {
      res = await http().getTable({
        resid: applyProjectId
      });
      if (res.data.error === 0) {
        this.setState({
          data: res.data.data
        });
      }
    } catch (error) {}
    this.setState({
      spin: false
    });
  };

  render() {
    const { data, spin, page, record, visible } = this.state;
    const columns = [
      {
        title: "序号",
        dataIndex: "name",
        key: "name",
        width: 150,
        render: (data, index) => {}
      },
      {
        title: "申请时间",
        dataIndex: "applyTime",
        key: "applyTime",
        width: 150
      },
      {
        title: "所属单位",
        dataIndex: "hospital",
        key: "hospital",
        width: 150
      },
      {
        title: "申请人",
        dataIndex: "doctor",
        key: "doctor",
        width: 150
      },
      {
        title: "研究类型",
        dataIndex: "studyType",
        key: "studyType",
        width: 150
      }
      // {
      //   title: 'Tags',
      //   key: 'tags',
      //   dataIndex: 'tags',
      //   render: tags => (
      //     <span>
      //       {tags.map(tag => {
      //         let color = tag.length > 5 ? 'geekblue' : 'green';
      //         if (tag === 'loser') {
      //           color = 'volcano';
      //         }
      //         return (
      //           <Tag color={color} key={tag}>
      //             {tag.toUpperCase()}
      //           </Tag>
      //         );
      //       })}
      //     </span>
      //   ),
      // },
    ];
    return (
      <div className="approveProjectList">
        {page === "listPage" ? (
          <Spin spinning={spin}>
            <Table
              key="2"
              className="approveProjectList-table"
              columns={columns}
              dataSource={data}
              scroll={{ x: 1000, y: "calc(100vh - 220px)" }}
            />
          </Spin>
        ) : null}
      </div>
    );
  }
}
export default Form.create()(ShowProject);
