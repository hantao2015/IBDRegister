import React, { Component } from "react";
import "./ApplyProject.less";
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
  Spin
} from "antd";
import http from "../../../utils/api";
import ShowImage from "../ApplyDataBase/ShowImage";
import applyDataBaseImage from "../../../assets/images/applyDataBase.jpg";
const applyProjectId = "620475440053";

class ApplyProject extends Component {
  state = {
    imageUrl: "",
    applyList: [],
    page: "listPage",
    record: {},
    loading: false
  };
  componentDidMount(){
     this.getApplyData();
  }

  //获取申请记录
  getApplyData = async () => {
    let res;
    this.setState({
      loading: true
    });
    try {
      res = await http().getTable({
        resid: applyProjectId
      });
      let data = [];

      res.data.data.map(item => {
        let studyType = item.studyType && item.studyType.split(",");
        item.studyType = studyType;
        data.push(item);
      });
      if (res.data.error == 0) {
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
    // console.log("e",e,type)
    // e.preventDefault();
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
      this.getApplyData();
    } catch (error) {
      message.error(error.message);
    }
  };
  onApply = () => {
    this.setState({
      page: "applyPage"
    });
  };
  onBack = () => {
    this.setState({
      page: "listPage"
    });
  };
  onCheck = item => {
      console.log("aaa")
    this.setState({
      page: "checkPage",
      record: item
    });
  };
  showImage = () => {
    this.setState({
      page: "showImagePage",
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { imageUrl, applyList, loading, page, record } = this.state;
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
      showImagePage: <ShowImage image={applyDataBaseImage}></ShowImage>,
      checkPage: (
        <Form
          {...formItemLayout}
          // onSubmit={this.handleSubmit}
          className="applyDataBase-form"
        >
          <h1>CHASE-IBD专项课题申请表</h1>
          <h3>基本信息</h3>
          <Form.Item label={<span>课题名称&nbsp;</span>}>
            <span>{record.doctor}</span>
          </Form.Item>
          <Form.Item label={<span>课题负责人&nbsp;</span>}>
            <span>{record.hospital}</span>
          </Form.Item>
          <Form.Item label={<span>申请人&nbsp;</span>}>
            <span>{record.post}</span>
          </Form.Item>
          <Form.Item label={<span>所属单位&nbsp;</span>}>
            <span>{record.phoneNumber}</span>
          </Form.Item>
          <Form.Item label={<span>职称&nbsp;</span>}>
            <span>{record.email}</span>
          </Form.Item>
          <Form.Item label={<span>联系电话&nbsp;</span>}>
            <span>{record.email}</span>
          </Form.Item>
          <Form.Item label={<span>E-mail&nbsp;</span>}>
            <span>{record.email}</span>
          </Form.Item>
          <Form.Item label={<span>拟定国内协作单位&nbsp;</span>}>
            <span>{record.email}</span>
          </Form.Item>
          <Form.Item label={<span>拟定国际协作单位&nbsp;</span>}>
            <span>{record.email}</span>
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

          <Form.Item label={<span>CD患者数量&nbsp;</span>}>
            <span>{record.CDPatientNumber}</span>
          </Form.Item>
          <Form.Item label={<span>UC患者数量&nbsp;</span>}>
            <span>{record.UCPatientNumber}</span>
          </Form.Item>
          <Form.Item label={<span>医师执照&nbsp;</span>}>
            <img
              src={record.doctorPhoto}
              alt="avatar"
              style={{ backgroundSize: "100%" }}
            />
          </Form.Item>

          <Button
            icon="download"
            type="primary"
            className="applyDataBase-form-print"
          >
            打印
          </Button>
        </Form>
      ),
      listPage: (
        <List
          className="applyDataBase-content-list"
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
                <Popconfirm
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
                    <a className="applyDataBase-content-list-word" href="#">
                      课题名称:{item.task}
                    </a>
                    <a className="applyDataBase-content-list-word" href="#">
                      所属单位:{item.hospital}
                    </a>
                  </React.Fragment>
                }
                description={item.status}
              />
              <div className='applyDataBase-content-list-word'>申请日期：{item.doctor}</div>
              <div>申请日期：{item.REC_CRTTIME}</div>
              {/* </Skeleton> */}
            </List.Item>
          )}
        />
      ),
      applyPage: (
        <Form
          {...formItemLayout}
          // onSubmit={this.handleSubmit}
          className="applyDataBase-form"
        >
          <div className='applyDataBase-form-contain'>
            <div className='applyDataBase-form-contain-info'>
          <h1>CHASE-IBD专项课题申请表</h1>
          <h3>基本信息</h3> 
          
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
          <h3>研究内容</h3>

          </div>
          <div className='applyDataBase-form-contain-notice'>
            <span>来自数委会的批注</span>
          <div>
            <ul>
              <li>XX教授：1f放松放松付所多付付付付付付</li>
              <li>XX教授：2</li>
              <li>XX教授：3</li>
              <li>XX教授：444</li>
            </ul>
          </div></div>
          </div>
          <Button
            className="applyDataBase-form-save"
            htmlType="submit"
            onClick={() => {
              this.handleSubmit(this, 1);
            }}
          >
            保存
          </Button>
          <Button
            type="primary"
            className="applyDataBase-form-submit"
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

    return <ApplyDataBase pages={pages} page={this.state.page} onBack={this.onBack} showImage={this.showImage} onApply={this.onApply}></ApplyDataBase>;
  }
}

export default Form.create()(ApplyProject);
