import React, { Component } from 'react';
import map from 'lodash/map';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchBlogs } from '../../redux/actions';

class BlogList extends Component {
  componentDidMount() {
    this.props.fetchBlogs();
    console.log(this.props.blogs);
  }

  renderBlogs() {
    return map(this.props.blogs, (blog) => {
      console.log(blog);
      return (
        <div className="card darken-1 horizontal" key={blog._id}>
          <div className="card-stacked">
            <div className="card-content">
              <span className="card-title">{blog.title}</span>
              <p>{blog._id}</p>
              <p>{blog.content}</p>
            </div>
            <div className="card-action">
              <Link to={`/blogs/${blog._id}`}>Read</Link>
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    return <div>{this.renderBlogs()}</div>;
  }
}

function mapStateToProps({ blogs }) {
  return { blogs };
}

export default connect(mapStateToProps, { fetchBlogs })(BlogList);
