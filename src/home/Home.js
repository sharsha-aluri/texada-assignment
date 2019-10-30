import React, { Component } from 'react';
import { PageHeader, Table, Button, Popconfirm, Icon, Form, notification } from 'antd';
import './Home.css';
import { getAirplaneData, deleteAirplaneData } from '../util/APIUtils';
import NewData from './NewData';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: props.currentUser,
            airplaneData : [],
            modalVisible: false,
            selectedData: null,
            columns : props.currentUser && props.currentUser.canEdit ? [
                {
                    title: 'Description',
                    dataIndex: 'description',
                    key: 'description',
                    render: (text, record) => <a onClick={() => this.handleAirplaneClicked(record)}>{text}</a>,
                    sorter: function(a, b){
                        if(a.description < b.description) { return -1; }
                        if(a.description > b.description) { return 1; }
                        return 0;
                    },
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Date Time',
                    dataIndex: 'datetime',
                    key: 'datetime',
                    sorter: function(a, b){
                        if(a.datetime < b.datetime) { return -1; }
                        if(a.datetime > b.datetime) { return 1; }
                        return 0;
                    },
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'longitude',
                    dataIndex: 'longitude',
                    key: 'longitude',
                    sorter: (a, b) => a.longitude - b.longitude,
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'latitude',
                    dataIndex: 'latitude',
                    key: 'latitude',
                    sorter: (a, b) => a.latitude - b.latitude,
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'elevation',
                    dataIndex: 'elevation',
                    key: 'elevation',
                    sorter: (a, b) => a.elevation - b.elevation,
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Action',
                    dataIndex: 'id',
                    key: 'id',
                    render: (text, record) =>
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.tableId)}>
                            <a>
                                <Icon type="delete" className="nav-icon" />
                            </a>
                        </Popconfirm>,
                },
            ] : [
                {
                    title: 'Description',
                    dataIndex: 'description',
                    key: 'description',
                    sorter: function(a, b){
                        if(a.description < b.description) { return -1; }
                        if(a.description > b.description) { return 1; }
                        return 0;
                    },
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Date Time',
                    dataIndex: 'datetime',
                    key: 'datetime',
                    sorter: function(a, b){
                        if(a.datetime < b.datetime) { return -1; }
                        if(a.datetime > b.datetime) { return 1; }
                        return 0;
                    },
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'longitude',
                    dataIndex: 'longitude',
                    key: 'longitude',
                    sorter: (a, b) => a.longitude - b.longitude,
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'latitude',
                    dataIndex: 'latitude',
                    key: 'latitude',
                    sorter: (a, b) => a.latitude - b.latitude,
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'elevation',
                    dataIndex: 'elevation',
                    key: 'elevation',
                    sorter: (a, b) => a.elevation - b.elevation,
                    sortDirections: ['descend', 'ascend'],
                },
            ]
        }

        this.handleAirplaneClicked = this.handleAirplaneClicked.bind(this);
        this.handleAddNewDataClick = this.handleAddNewDataClick.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        const data = getAirplaneData()
        this.setState({
            airplaneData : data
        });
    }

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    render() {
        const selectedData = this.state.selectedData

        const CollectionCreateForm = Form.create(
            {
                name: 'form_in_modal',
                mapPropsToFields(props) {
                    if (selectedData) {
                        return {
                            description: Form.createFormField({
                                ...props.description,
                                value: selectedData.description
                            }),
                            latitude: Form.createFormField({
                                ...props.latitude,
                                value: selectedData.latitude
                            }),
                            longitude: Form.createFormField({
                                ...props.longitude,
                                value: selectedData.longitude
                            }),
                            elevation: Form.createFormField({
                                ...props.elevation,
                                value: selectedData.elevation
                            }),
                        };
                    } else {
                        return {};
                    }
                },
            }
        )(NewData)

        return (
            <div className="home-container">
                <div>
                    <PageHeader title="Airplane Data" extra={this.renderNavigationButtons()} />
                    <Table
                        rowKey={record => record.tableId}
                        columns={this.state.columns}
                        dataSource={this.state.airplaneData}
                        pagination={false}
                    />
                </div>

                <CollectionCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.modalVisible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleSubmit}
                    isEdit={this.state.selectedData != null}
                    id={this.state.selectedData ? this.state.selectedData.tableId : null}
                />
            </div>
        );
    }

    renderNavigationButtons() {
        return (
            [
                <Button key="1" onClick={this.handleAddNewDataClick}>Add New Row</Button>,
            ]
        )
    }

    handleAirplaneClicked(airplane) {
        this.setState({
            modalVisible: true,
            selectedData: airplane
        });
    }

    handleAddNewDataClick() {
        this.setState({
            modalVisible: true,
            selectedData: null
        });
    }

    handleSubmit() {
        this.setState({
            modalVisible: false,
            selectedData: null
        });

        this.loadData()
    }

    handleCancel() {
        this.setState({
            modalVisible: false,
            selectedData: null
        });
    }

    handleDelete(tableId) {
        deleteAirplaneData(tableId);
        notification.success({
            message: 'Texada',
            description: "Data deleted successfully!",
        });
        this.loadData();
    }
}

export default Home;