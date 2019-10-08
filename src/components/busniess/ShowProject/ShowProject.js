import React, { Component } from "react";
import {
  Modal,
  Tag,
  Button,
  Table,
  message,
  Spin,
  Form,
  Input,
  Divider
} from "antd";
import "./ShowProject.less";
import http from "../../../utils/api";
import CommitCard from "../ApplyProject/CommitCard";
const showProjectId = "622207867138";
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
    console.log("record", record);
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
  onjoin = async record => {
    const doctorInfo = JSON.parse(localStorage.getItem("doctorInfo"));
    record.joinPersonID = doctorInfo.doctorId;
    let res;
    try {
      res = await http().addRecords({
        resid: applyProjectId,
        data: [record]
      });
      if (res.data.Error == 0) {
        message.success("提交成功");
      }
      await this.getData();
    } catch (error) {
      message.error(error.message);
    }
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
  getApplyData = async () => {
    let res;
    try {
      res = await http().getTable({
        resid: applyProjectId
      });
      if (res.data.error === 0) {
        console.log("res.data.data", res.data.data);
        let data = [];
        //筛选出 申请加入的记录。
        res.data.data.map(item => {
          if (item.joinPersonID) {
            data.push(item.applyId);
          }
        });
        return data;
      }
    } catch (error) {}
  };
  getData = async () => {
    const doctorInfo = JSON.parse(localStorage.getItem("doctorInfo"));
    this.setState({
      spin: true
    });
    let res;
    try {
      res = await http().getTable({
        resid: showProjectId
      });
      if (res.data.error === 0) {
        let applyData = await this.getApplyData();

        console.log("applyData", applyData);
        let data = [];
        res.data.data.map(item => {
          console.log("item", item);
          //如果 没有申请加入记录或者 这条记录是自己创建的，就标记 isJoined为true
          if (applyData.includes(item.applyId) || item.doctorId == doctorInfo.doctorId ) {
            item.isJoined = true;
            data.push(item);
          } else {
            data.push(item);
          }
        });
        console.log("data",data)
        this.setState({
          data
        });
      }
    } catch (error) {}

    this.setState({
      spin: false
    });
  };

  render() {
    const { data, spin, page, record } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const columns = [
      {
        title: "序号",
        dataIndex: "number",
        key: "number",
        width: 80
      },
      {
        title: "申请时间",
        dataIndex: "applyTime",
        key: "applyTime",
        width: 150
      },
      {
        title: "课题名称",
        dataIndex: "task",
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
        title: "审批状态",
        dataIndex: "status",
        key: "status",
        width: 150,
        render: data => {
          return (
            <Tag
            color={
              data === "进行中" ? "blue" : data === "已完成" ? "geekblue" : "green"
            }
            >
              {data}
            </Tag>
          );
        }
      },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
        width: 150,
        render: (text, record) => {
          return (
            <span>
              <a
                onClick={() => {
                  this.onCheck(record);
                }}
              >
                查看
              </a>
              <Divider type="vertical" />
              {!record.isJoined ?
              <a
                onClick={() => {
                  this.onjoin(record);
                }}
              >
                申请加入
              </a>:null}
            </span>
          );
        }
      }
    ];
    const checkPage = (
      <React.Fragment>
        {page === "checkPage" ? (
          <Button
            icon={"rollback"}
            type="primary"
            onClick={this.onBack}
            className="approveList-btn"
          >
            返回
          </Button>
        ) : null}
        <Form
          {...formItemLayout}
          className="showProject-form"
          id="applyProjectForm"
        >
          <div className="applyProject-form-contain">
            <div className="applyProject-form-contain-info">
              <h1 style={{ textAlign: "center" }}>CHASE-IBD专项课题申请表</h1>
              <h3 style={{ textAlign: "center" }}>基本信息</h3>
              <Form.Item label={<span>课题名称&nbsp;</span>}>
                <span>{record.task}</span>
              </Form.Item>
              <Form.Item label={<span>课题负责人&nbsp;</span>}>
                <span>{record.taskPrincipal}</span>
              </Form.Item>
              <Form.Item label={<span>申请人&nbsp;</span>}>
                <span>{record.doctor}</span>
              </Form.Item>
              <Form.Item label={<span>所属单位&nbsp;</span>}>
                <span>{record.hospital}</span>
              </Form.Item>
              <Form.Item label={<span>职称&nbsp;</span>}>
                <span>{record.post}</span>
              </Form.Item>
              <Form.Item label={<span>联系电话&nbsp;</span>}>
                <span>{record.phoneNumber}</span>
              </Form.Item>
              <Form.Item label={<span>E-mail&nbsp;</span>}>
                <span>{record.email}</span>
              </Form.Item>
              <Form.Item label={<span>拟定国内协作单位&nbsp;</span>}>
                <span>{record.inlandUnit}</span>
              </Form.Item>
              <Form.Item label={<span>拟定国际协作单位&nbsp;</span>}>
                <span>{record.foreignUnit}</span>
              </Form.Item>
              {/* <Form.Item label={<span>IBD治疗团队名单&nbsp;</span>}>
          <span>{record.teamPeople}</span>&nbsp;&nbsp;
          <span>{record.teamPeople2}</span>&nbsp;&nbsp;
          <span>{record.teamPeople3}</span>&nbsp;&nbsp;
        </Form.Item> */}
              {/* <Form.Item label={<span>选择参与数据库研究&nbsp;</span>}>
          <Checkbox.Group
            options={options}
            defaultValue={record.studyType}
            onChange={this.onChangeCheckbox}
          />
        </Form.Item> */}
              <h3 style={{ textAlign: "center" }}>研究内容</h3>
              <Form.Item label={<span>研究的理由&nbsp;</span>}>
                <span>{record.studyReason}</span>
              </Form.Item>
              <Form.Item label={<span>研究区域&nbsp;</span>}>
                <span>{record.studyArea}</span>
              </Form.Item>
              <Form.Item
                label={
                  <span>研究目标（主要目标，次要目标，附加目标）&nbsp;</span>
                }
              >
                <span>{record.studyTarget}</span>
              </Form.Item>
              <Form.Item
                label={
                  <span>研究终点（主要终点，次要终点，附加终点）&nbsp;</span>
                }
              >
                <span>{record.studyLast}</span>
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    研究设计与描述（研究描述，研究周期，研究设计，剂量和终点的合理性）&nbsp;
                  </span>
                }
              >
                <span>{record.studyDescription}</span>
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    项目入选（入选标准，排除标准包括药物，治疗和饮食）&nbsp;
                  </span>
                }
              >
                <span>{record.studySelected}</span>
              </Form.Item>
              <Form.Item
                label={
                  <span>研究终点（主要终点，次要终点，附加终点）&nbsp;</span>
                }
              >
                <span>{record.studyLast}</span>
              </Form.Item>
              <Form.Item
                label={<span>评估（疗效评估，安全评估，其他评估）&nbsp;</span>}
              >
                <span>{record.studyAssess}</span>
              </Form.Item>
              <Form.Item
                label={<span>实验室检查：检查具体指标参数&nbsp;</span>}
              >
                <span>{record.studyCheck}</span>
              </Form.Item>
              <Form.Item
                label={<span>评估（疗效评估，安全评估，其他评估）&nbsp;</span>}
              >
                <span>{record.studyAssess}</span>
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    统计方法（统计分析计划，人口统计学和其他基线特征分析，疗效分析，药代动力学分析，药效学分析，安全分析）&nbsp;
                  </span>
                }
              >
                <span>{record.staticMethod}</span>
              </Form.Item>
              <Form.Item label={<span>中期分析和提前终止的标准&nbsp;</span>}>
                <span>{record.standard}</span>
              </Form.Item>
              <Form.Item label={<span>样本量的确定&nbsp;</span>}>
                <span>{record.sure}</span>
              </Form.Item>
              <Form.Item label={<span>伦理委员会&nbsp;</span>}>
                <span>{record.committee}</span>
              </Form.Item>
              <Form.Item label={<span>参考资料&nbsp;</span>}>
                <span>{record.referenceData}</span>
              </Form.Item>
            </div>
            {record["621432069832"] ? (
              <div className="applyProject-form-contain-notice">
                <span>来自数委会的批注</span>
                {record["621432069832"] &&
                  record["621432069832"].map(item => {
                    return (
                      <CommitCard key={item.REC_ID} data={item}></CommitCard>
                    );
                  })}
              </div>
            ) : null}
          </div>
        </Form>
      </React.Fragment>
    );
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
        ) : (
          checkPage
        )}
      </div>
    );
  }
}
export default Form.create()(ShowProject);
