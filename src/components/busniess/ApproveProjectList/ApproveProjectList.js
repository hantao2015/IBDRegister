import React, { Component } from "react";
import { Modal, Tag, Button, Table, message, Spin, Form, Input } from "antd";
import "./ApproveProjectList.less";
import http from "../../../utils/api";
import CommitCard from "../ApplyProject/CommitCard";
const applyProjectId = "621790809693"; //研究项目申请表-审核
const suggestId = "621432069832";

const { TextArea } = Input;

class ApproveProjectList extends React.Component {
  state = {
    data: [{}],
    page: "listPage",
    spin: false,
    record: {},
    visible: false,
    currentSuggest: "" // 当前登录人的建议
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
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    record["621432069832"].map(item => {
      if (userInfo.UserInfo.EMP_HANDPHONE == item.phone) {
        this.setState({
          currentSuggest: item
        });
      }
    });
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
  onAgreeOrReject = async type => {
    let res;
    let data;
    if (type === 1) {
      data = [
        {
          ...this.state.record,
          isPass: "Y"
        }
      ];
    } else {
      data = [
        {
          ...this.state.record,
          isPass: "N"
        }
      ];
    }
    try {
      res = await http().modifyRecords({
        resid: applyProjectId,
        data
      });
      if (res.data.Error === 0) {
        message.success("操作成功");
      }
      this.setState({
        page: "listPage"
      });
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
      let currentSuggest;
      if (this.state.currentSuggest) {
        currentSuggest = JSON.parse(JSON.stringify(this.state.currentSuggest));
        currentSuggest.suggest = values.suggest;
      }
      let res;
      let data = [
        {
          ...currentSuggest
          // projectId: record.applyId
        }
      ];
      try {
        res = await http().modifyRecords({
          resid: suggestId,
          data
        });
        if (res.data.Error === 0) {
          message.success("添加成功");
          this.onBack();
          await this.getData();
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
      res = await http().getTableNew({
        resid: applyProjectId,
        subresid: suggestId
      });
      if (res.data.Error === 0) {
        let data = [];
        res.data.data.map((item, index) => {
          item.number = index + 1;
          data.push(item);
        });
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
    const { data, spin, page, record, visible, currentSuggest } = this.state;
    const { getFieldDecorator } = this.props.form;
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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
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
        title: "课题名称",
        dataIndex: "task",
        key: "task",
        width: 150
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
        title: "发起人",
        dataIndex: "doctor",
        key: "doctor",
        width: 150
      },
      {
        title: "申请加入人",
        dataIndex: "joinPerson",
        key: "joinPerson",
        width: 150
      },
      {
        title: "状态",
        dataIndex: "applyPersonStatus",
        key: "applyPersonStatus",
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
                data === "进行中"
                  ? "blue"
                  : data === "已完成"
                  ? "geekblue"
                  : "green"
              }
            >
              {data}
            </Tag>
          );
        }
      },
      {
        title: "操作",
        key: "action",
        render: (text, record) => (
          <span>
            <a
              onClick={() => {
                this.onCheck(record);
              }}
            >
              查看/建议
            </a>
          </span>
        ),
        width: 150
      }
    ];
    const checkPage = (
      <Form
        {...formItemLayout}
        // onSubmit={this.handleSubmit}
        className="approveProjectList-form"
      >
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
        <div className="approveList-btns">
          {!record.isPass ? (
            <Button
              className="approveList-btn"
              type="primary"
              onClick={() => {
                this.onAgreeOrReject(1);
              }}
            >
              同意
            </Button>
          ) : null}
          {/* <Button
              className="approveList-btn"
              type="danger"
              onClick={() => {
                this.onAgreeOrReject(2);
              }}
            >
              拒绝
            </Button> */}
          <Button
            className="approveList-btn"
            type="primary"
            onClick={this.onSuggest}
          >
            建议
          </Button>
        </div>
        <div className="approveProjectList-form-contain">
          <div className="approveProjectList-form-contain-info">
            <h1>CHASE-IBD专项课题申请表</h1>
            <h3>基本信息</h3>
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
            <h3>研究内容</h3>

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
            <Form.Item label={<span>实验室检查：检查具体指标参数&nbsp;</span>}>
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
        <Modal
          title="建议"
          visible={visible}
          width={500}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose={true}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              取消
            </Button>,
            <Button
              htmlType="submit"
              type="primary"
              onClick={() => {
                this.submitSuggest();
              }}
            >
              提交
            </Button>
          ]}
        >
          <Form {...formItemLayout} className="editNotice-form">
            {/* <h1>消息编辑</h1> */}
            {getFieldDecorator("suggest", {
              initialValue: currentSuggest.suggest,
              rules: [
                {
                  required: true,
                  message: "请输入建议",
                  whitespace: true
                }
              ]
            })(
              <TextArea
                placeholder="请输入建议"
                className="editNotice-form-item-textarea"
              />
            )}
          </Form>
        </Modal>
      </Form>
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
export default Form.create()(ApproveProjectList);
