import React, { Component } from "react";
import "./ApplyProject.less";
import ReactToPrint from "react-to-print";
import ApplyDataBase from "../ApplyDataBase";
import {
  Collapse,
  Icon,
  Input,
  Button,
  Form,
  Checkbox,
  List,
  Skeleton,
  Avatar,
  message,
  Popconfirm,
  Spin,
  Card,
  Steps,
  Popover,
  Tag,
  Modal
} from "antd";
import http from "../../../utils/api";
import ShowImage from "../ApplyDataBase/ShowImage";
import CommitCard from "./CommitCard";
import applyProjectImage1 from "../../../assets/images/applyProject1.jpg";
import applyProjectImage2 from "../../../assets/images/applyProject2.jpg";
import TextArea from "antd/lib/input/TextArea";
const applyProjectId = "620475440053";
const suggestId = "621432069832";
const { Meta } = Card;
const { Step } = Steps;

const customDot = (dot, { status, index }) => (
  <Popover content={<span>{status}</span>}>{dot}</Popover>
);

class ApplyProject extends Component {
  state = {
    imageUrl: "",
    applyList: [],
    page: "listPage",
    record: {},
    postilData: [],
    loading: false,
  };
  componentDidMount = async () => {
    await this.getApplyData();
  };

  //获取申请记录
  getApplyData = async () => {
    let res;
    this.setState({
      loading: true
    });
    try {
      res = await http().getTableNew({
        resid: applyProjectId,
        subresid: suggestId
      });
      if (res.data.Error == 0) {
        let data = [];
        res.data &&
          res.data.data &&
          res.data.data.map(item => {
            let studyType = item.studyType && item.studyType.split(",");
            item.studyType = studyType;
            data.push(item);
          });
        this.setState({
          applyList: data
        });
      }
    } catch (error) {
      message.error(error.message);
    }
    this.setState({
      loading: false
    });
  };

  handleSubmit = (e, type) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.onSubmit(values, type);
      }
    });
  };
  //提交列表中的一条记录
  onSubmitRecord = async record => {
    let res;
    record.isSubmit = "Y";
    try {
      res = await http().modifyRecords({
        resid: applyProjectId,
        data: [record]
      });
      if (res.data.Error == 0) {
        message.success("提交成功");
        await this.getApplyData();
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  //提交表单
  onSubmit = async (values, type) => {
    let res;
    let obj = {};
    let study = values.study && values.study.toString();
    if (type === 1) {
      obj = {
        doctor: values.doctor,
        hospital: values.hospital,
        task: values.task,
        phoneNumber: values.phone,
        email: values.email,
        taskPrincipal: values.taskPrincipal,
        studyType: values.studyType,
        inlandUnit: values.inlandUnit,
        foreignUnit: values.foreignUnit,
        studyReason: values.studyReason,
        studyArea: values.studyArea,
        studyTarget: values.studyTarget,
        studyDescription: values.studyDescription,
        studyLast: values.studyLast,
        studySelected: values.studySelected,
        studyAssess: values.studyAssess,
        studyCheck: values.studyCheck,
        staticMethod: values.staticMethod,
        standard: values.standard,
        sure: values.sure,
        committee: values.committee,
        referenceData: values.referenceData
      };
    } else {
      obj = {
        doctor: values.doctor,
        hospital: values.hospital,
        task: values.task,
        phoneNumber: values.phone,
        email: values.email,
        taskPrincipal: values.taskPrincipal,
        studyType: values.studyType,
        inlandUnit: values.inlandUnit,
        foreignUnit: values.foreignUnit,
        studyReason: values.studyReason,
        studyArea: values.studyArea,
        studyTarget: values.studyTarget,
        studyDescription: values.studyDescription,
        studyLast: values.studyLast,
        studySelected: values.studySelected,
        studyAssess: values.studyAssess,
        studyCheck: values.studyCheck,
        staticMethod: values.staticMethod,
        standard: values.standard,
        sure: values.sure,
        committee: values.committee,
        referenceData: values.referenceData,
        isSubmit: "Y"
      };
    }
    try {
      res = await http().addRecords({
        resid: applyProjectId,
        data: [obj]
      });
      if (res.data.Error == 0) {
        message.success("申请成功！");
      }
      this.setState({
        page: "listPage"
      });
      await this.getApplyData();
    } catch (error) {
      message.error(error.message);
    }
  };
  onApply = () => {
    this.setState({
      page: "applyPage"
    });
  };
  onLookSchedule = record => {
    const modal = Modal.success({
      title: "进度查询",
      width: 500,
      content: (
        <div style={{marginTop:"20px"}}>
          <div style={{marginBottom:"20px"}}>课题名称：{record.task}</div>
          <Steps
            current={
              record.status === "通过" || record.status === "拒绝" ? 2 : 1
            }
            progressDot={customDot}
          >
            <Step title="提交报告" />
            <Step title="审核" />
            <Step title="完成" />
          </Steps>
          ,
        </div>
      )
    });
  };
  onBack = () => {
    this.setState({
      page: "listPage"
    });
  };
  onCheck = item => {
    this.setState({
      page: "checkPage",
      record: item
    });
  };
  showImage = () => {
    this.setState({
      page: "showImagePage"
    });
  };
  // //打印
  print = () => {
    var printBox = document.getElementById("applyProjectForm");
    //拿到打印的区域的html内容
    var newContent = printBox.innerHTML;
    //将旧的页面储存起来，当打印完成后返给给页面。
    var oldContent = document.body.innerHTML;
    //赋值给body
    document.body.innerHTML = newContent;
    //执行window.print打印功能
    window.print();
    // 重新加载页面，以刷新数据。以防打印完之后，页面不能操作的问题
    window.location.reload();
    document.body.innerHTML = oldContent;
    return false;
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      imageUrl,
      applyList,
      loading,
      page,
      record,
      postilData
    } = this.state;
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
    const options = [
      { label: "单中心研究", value: "单中心研究" },
      { label: "多中心研究", value: "多中心研究" },
      { label: "第三方研究", value: "第三方研究" },
      { label: "所有研究", value: "所有研究" }
    ];
    const pages = {
      showImagePage: (
        <React.Fragment>
          <ShowImage image={applyProjectImage1}></ShowImage>
          <ShowImage image={applyProjectImage2}></ShowImage>
        </React.Fragment>
      ),
      checkPage: (
        <React.Fragment>
          <Form
            {...formItemLayout}
            // onSubmit={this.handleSubmit}
            className="applyProject-form"
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
                  label={
                    <span>评估（疗效评估，安全评估，其他评估）&nbsp;</span>
                  }
                >
                  <span>{record.studyAssess}</span>
                </Form.Item>
                <Form.Item
                  label={<span>实验室检查：检查具体指标参数&nbsp;</span>}
                >
                  <span>{record.studyCheck}</span>
                </Form.Item>
                <Form.Item
                  label={
                    <span>评估（疗效评估，安全评估，其他评估）&nbsp;</span>
                  }
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
          <Button
            icon="download"
            type="primary"
            className="applyProject-form-print"
            onClick={this.print}
          >
            打印
          </Button>
        </React.Fragment>
      ),
      listPage: (
        <React.Fragment>
          <List
            className="applyProject-content-list"
            itemLayout="horizontal"
            dataSource={applyList}
            renderItem={item => (
              <List.Item
                actions={[
                  <a
                    key="list-loadmore-edit"
                    onClick={() => {
                      this.onCheck(item);
                    }}
                  >
                    查看
                  </a>,
                  item.isSubmit === "Y" ? (
                    <a
                      key="list-loadmore-edit"
                      onClick={() => {
                        this.onLookSchedule(item);
                      }}
                    >
                      进度查询
                    </a>
                  ) :  <Popconfirm
                  title="你确定要提交吗"
                  onConfirm={() => {
                    this.onSubmitRecord(item);
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <a key="list-loadmore-edit">提交</a>
                </Popconfirm>
                ]}
              >
                {/* <Skeleton avatar title={false} loading={item.doctor} active> */}
                <List.Item.Meta
                  // avatar={
                  //   <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  // }
                  title={
                    <React.Fragment>
                      <a className="applyProject-content-list-word" href="#">
                        课题名称:{item.task}
                      </a>
                      <a className="applyProject-content-list-word" href="#">
                        所属单位:{item.hospital}
                      </a>
                    </React.Fragment>
                  }
                  description={
                    <React.Fragment>
                      <Tag
                        color={
                          item.status === "通过"
                            ? "geekblue"
                            : item.status === "拒绝"
                            ? "red"
                            : "green"
                        }
                      >
                        {item.status}
                      </Tag>{" "}
                    </React.Fragment>
                  }
                />

                <div>申请日期：{item.REC_CRTTIME}</div>
                {/* </Skeleton> */}
              </List.Item>
            )}
          />
        </React.Fragment>
      ),
      schedulePage: (
        <div>
          <h1 style={{ textAlign: "center" }}>{record.task}</h1>
          <Steps
            current={
              record.status === "通过" || record.status === "拒绝" ? 2 : 1
            }
            progressDot={customDot}
          >
            <Step title="提交报告" />
            <Step title="审核" />
            <Step title="完成" />
          </Steps>
          ,
        </div>
      ),
      applyPage: (
        <Form
          {...formItemLayout}
          // onSubmit={this.handleSubmit}
          className="applyProject-form"
        >
          <div className="applyProject-form-contain">
            <div className="applyProject-form-contain-info">
              <h1 style={{ textAlign: "center" }}>CHASE-IBD专项课题申请表</h1>
              <h3 style={{ textAlign: "center" }}>基本信息</h3>

              <Form.Item label={<span>课题名称&nbsp;</span>}>
                {getFieldDecorator("task", {
                  rules: [
                    {
                      required: true,
                      message: "请输入课题名称",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label={<span>课题负责人&nbsp;</span>}>
                {getFieldDecorator("taskPrincipal", {
                  rules: [
                    {
                      required: true,
                      message: "请输入课题负责人",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label={<span>申请人&nbsp;</span>}>
                {getFieldDecorator("doctor", {
                  rules: [
                    {
                      required: true,
                      message: "请输入申请人",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label={<span>所属单位&nbsp;</span>}>
                {getFieldDecorator("hospital", {
                  rules: [
                    {
                      required: true,
                      message: "请输入所属单位",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label={<span>职称&nbsp;</span>}>
                {getFieldDecorator("post", {
                  rules: [
                    {
                      required: true,
                      message: "请输入您的职称！",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label={<span>联系电话&nbsp;</span>}>
                {getFieldDecorator("phone", {
                  rules: [
                    {
                      required: true,
                      message: "请输入您的联系电话!",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label={<span>E-mail&nbsp;</span>}>
                {getFieldDecorator("email", {
                  rules: [
                    {
                      required: true,
                      message: "请输入您的邮箱!",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label={<span>拟定国内协作单位&nbsp;</span>}>
                {getFieldDecorator("inlandUnit", {
                  rules: [
                    {
                      required: true,
                      message: "请输入拟定国内协作单位!",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label={<span>拟定国际协作单位&nbsp;</span>}>
                {getFieldDecorator("forignUnit", {
                  rules: [
                    {
                      required: true,
                      message: "请输入拟定国际协作单位!",
                      whitespace: true
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <h3 style={{ textAlign: "center" }}>研究内容</h3>
              <Form.Item label={<span>研究的理由&nbsp;</span>}>
                {getFieldDecorator("studyReason", {
                  rules: [
                    {
                      required: true,
                      message: "请输入研究的理由!",
                      whitespace: true
                    }
                  ]
                })(<TextArea className="applyProject-form-textarea" />)}
              </Form.Item>
              <Form.Item label={<span>研究区域&nbsp;</span>}>
                {getFieldDecorator("studyArea", {
                  rules: [
                    {
                      required: true,
                      message: "请输入研究区域!",
                      whitespace: true
                    }
                  ]
                })(<TextArea className="applyProject-form-textarea" />)}
              </Form.Item>
              <Form.Item
                label={
                  <span>研究目标（主要目标，次要目标，附加目标）&nbsp;</span>
                }
              >
                {getFieldDecorator("studyTarget", {
                  rules: [
                    {
                      required: true,
                      message: "请输入研究目标!",
                      whitespace: true
                    }
                  ]
                })(<TextArea className="applyProject-form-textarea" />)}
              </Form.Item>
              <Form.Item
                label={
                  <span>研究终点（主要终点，次要终点，附加终点）&nbsp;</span>
                }
              >
                {getFieldDecorator("studyLast", {
                  rules: [
                    {
                      required: true,
                      message: "请输入研究终点!",
                      whitespace: true
                    }
                  ]
                })(<TextArea className="applyProject-form-textarea" />)}
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    研究设计与描述（研究描述，研究周期，研究设计，剂量和终点的合理性）&nbsp;
                  </span>
                }
              >
                {getFieldDecorator("studyDescription", {
                  rules: [
                    {
                      required: true,
                      message: "请输入研究设计与描述!",
                      whitespace: true
                    }
                  ]
                })(<TextArea className="applyProject-form-textarea" />)}
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    项目入选（入选标准，排除标准包括药物，治疗和饮食）&nbsp;
                  </span>
                }
              >
                {getFieldDecorator("studySelected", {
                  rules: [
                    {
                      required: true,
                      message: "请输入项目入选!",
                      whitespace: true
                    }
                  ]
                })(<TextArea className="applyProject-form-textarea" />)}
              </Form.Item>
              <Form.Item
                label={<span>评估（疗效评估，安全评估，其他评估）&nbsp;</span>}
              >
                {getFieldDecorator("studyAssess", {
                  rules: [
                    {
                      required: true,
                      message: "请输入评估!",
                      whitespace: true
                    }
                  ]
                })(<TextArea className="applyProject-form-textarea" />)}
              </Form.Item>
              <Form.Item
                label={<span>实验室检查：检查具体指标参数&nbsp;</span>}
              >
                {getFieldDecorator("studyCheck", {
                  rules: [
                    {
                      required: true,
                      message: "请输入实验室检查!",
                      whitespace: true
                    }
                  ]
                })(<TextArea className="applyProject-form-textarea" />)}
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    统计方法（统计分析计划，人口统计学和其他基线特征分析，疗效分析，药代动力学分析，药效学分析，安全分析）&nbsp;
                  </span>
                }
              >
                {getFieldDecorator("staticMethod", {
                  rules: [
                    {
                      required: true,
                      message: "请输入统计方法!",
                      whitespace: true
                    }
                  ]
                })(<TextArea className="applyProject-form-textarea" />)}
              </Form.Item>
              <Form.Item label={<span>中期分析和提前终止的标准&nbsp;</span>}>
                {getFieldDecorator("standard", {
                  rules: [
                    {
                      required: true,
                      message: "请输入中期分析和提前终止的标准!",
                      whitespace: true
                    }
                  ]
                })(<TextArea className="applyProject-form-textarea" />)}
              </Form.Item>
              <Form.Item label={<span>样本量的确定&nbsp;</span>}>
                {getFieldDecorator("sure", {
                  rules: [
                    {
                      required: true,
                      message: "请输入样本量的确定!",
                      whitespace: true
                    }
                  ]
                })(<TextArea className="applyProject-form-textarea" />)}
              </Form.Item>
              <Form.Item label={<span>伦理委员会&nbsp;</span>}>
                {getFieldDecorator("committee", {
                  rules: [
                    {
                      required: true,
                      message: "请输入伦理委员会!",
                      whitespace: true
                    }
                  ]
                })(<TextArea className="applyProject-form-textarea" />)}
              </Form.Item>
              <Form.Item label={<span>参考资料&nbsp;</span>}>
                {getFieldDecorator("referenceData", {
                  rules: [
                    {
                      required: true,
                      message: "请输入参考资料!",
                      whitespace: true
                    }
                  ]
                })(<TextArea className="applyProject-form-textarea" />)}
              </Form.Item>
            </div>
          </div>
          <Button
            className="applyProject-form-save"
            htmlType="submit"
            onClick={() => {
              this.handleSubmit(this, 1);
            }}
          >
            保存
          </Button>
          <Button
            type="primary"
            className="applyProject-form-submit"
            htmlType="submit"
            onClick={() => {
              this.handleSubmit(this, 2);
            }}
          >
            提交
          </Button>
        </Form>
      )
    };

    return (
      <React.Fragment>
        {/* <ReactToPrint
          trigger={() => (
            <Button
              icon="download"
              type="primary"
              className="applyDataBase-form-print"
            >
              打印
            </Button>
          )}
          content={() => this.componentRef}
        /> */}
        <ApplyDataBase
          pages={pages}
          page={this.state.page}
          onBack={this.onBack}
          showImage={this.showImage}
          onApply={this.onApply}
          ref={el => (this.componentRef = el)}
        ></ApplyDataBase>
      </React.Fragment>
    );
  }
}

export default Form.create()(ApplyProject);
