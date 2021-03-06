import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql, StaticQuery } from 'gatsby'
import PreviewCompatibleImage from './PreviewCompatibleImage'

class BlogList extends React.Component {
  render() {
    const { data } = this.props
    const { edges: posts } = data.allMarkdownRemark

    return (
      <ul className="blogList">
        {posts &&
          posts.map(({ node: post, i }) => (
            <li className="blogList-item">
              <article key={i} className={`blogItem ${post.frontmatter.featuredpost ? 'is-featured' : ''}`}>
                <header>
                  {post.frontmatter.featuredimage ? (
                    <Link to={post.fields.slug}>
                      <div className="featuredImage">
                        <PreviewCompatibleImage
                          imageInfo={{
                            image: post.frontmatter.featuredimage,
                            alt: `featured image thumbnail for post ${post.frontmatter.title}`,
                          }}
                        />
                      </div>
                    </Link>
                  ) : null}
                  <div className="post-content">
                    <Link to={post.fields.slug}>
                      <h2>{post.frontmatter.title}</h2>
                    </Link>
                    <span>
                      {post.frontmatter.date}
                    </span>
                  </div>
                </header>
                <p>{post.excerpt}</p>
                <Link className="button secondary" to={post.fields.slug}>Keep Reading</Link>
              </article>
            </li>
          ))
        }
      </ul>
    )
  }
}

BlogList.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default () => (
  <StaticQuery
    query={graphql`
      query BlogListQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
        ) {
          edges {
            node {
              excerpt(pruneLength: 400)
              id
              fields {
                slug
              }
              frontmatter {
                title
                templateKey
                date(formatString: "MMMM DD, YYYY")
                featuredpost
                featuredimage {
                  childImageSharp {
                    fluid(maxWidth: 1280, maxHeight: 720, quality: 100) {
                      ...GatsbyImageSharpFluid
                    }
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <BlogList data={data} count={count} />}
  />
)
