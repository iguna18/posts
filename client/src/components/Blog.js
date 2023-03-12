import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Link
} from "react-router-dom"
import { deleteBlog, toggleBlogLike } from '../reducers/thunks'
import { useDispatch } from 'react-redux'

// const Blog = ({ blog, blogStyle, isCreatedByCurrentUser }) => {
//   const [visible, setVisible] = useState(false)
//   const [isRemoved, setIsRemoved] = useState(false)
//   const dispatch = useDispatch()

//   const toggleVisible = () => {
//     setVisible(!visible)
//   }

  // return (
  //   <li style={isRemoved ? { display:'none' } : blogStyle}>
  //     <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
  //     <button id='viewbutton' onClick={toggleVisible}>{visible?'hide':'view'}</button>
  //     {
  //       visible && (
  //         <>
  //           <p>{blog.url}</p>
  //           <p>
  //             {blog.likes}
  //             <button id='likebutton' onClick={() => dispatch(toggleBlogLike(blog.id))}>like</button>
  //           </p>
  //           {
  //             isCreatedByCurrentUser && (
  //               <p>
  //                 <button onClick={() => dispatch(deleteBlog(blog, setIsRemoved))}>
  //                   remove
  //                 </button>
  //               </p>
  //             )
  //           }
  //         </>
  //       )
  //     }
  //   </li>
  // )
// }

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const ImagesSection = ({imageinfos}) => {
  if(!imageinfos || imageinfos.length == 0) {
    return null
  }
    return (
      <div style={{ position:'relative' }}>
        <div style={{
            display: imageinfos.length > 1 ? '' : 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(360, 360, 360, 0.5)',
          }}>
          {imageinfos.length} photos
        </div>
        <CardMedia
          component="img"
          height="194"
          image={`data:${imageinfos[0].mimetype};base64,${imageinfos[0].data}`}
          alt={imageinfos[0].originalname}/>
      </div>
    )

  // if(imageinfos.length == 1) {
  // }
  // if(imageinfos.length >= 2) {n
  //   return (
  //     <div style={{
  //       display:'flex',
  //       flexDirection:'row',
  //       gap:'2px'
  //     }}>
  //       <img src={`data:${imageinfos[0].mimetype};base64,${imageinfos[0].data}`} style={{
  //         objectFit:'scale-down'
  //       }}/>
  //       <img src={`data:${imageinfos[1].mimetype};base64,${imageinfos[1].data}`} style={{
  //         objectFit:'scale-down'
  //       }}/>
  //     </div>
  //   )
  // }
  // return (
  //   <div style={{
  //     display:'flex',
  //     flexDirection:'row',
  //     gap:'2px'
  //   }}>
  //     <div>
  //       <img src={`data:${imageinfos[0].mimetype};base64,${imageinfos[0].data}`} style={{
  //         objectFit:'scale-down'
  //       }}/>
  //     </div>
  //     <div>
  //       <img src={`data:${imageinfos[1].mimetype};base64,${imageinfos[1].data}`} style={{
  //         objectFit:'scale-down'
  //       }}/>
  //      <div style={{
  //        position:'relative'
  //      }}>
  //        <div style={{
  //          position: 'absolute',
  //          top: 0,
  //          left: 0,
  //          width: '100%',
  //          height: '100%',
  //          backgroundColor: 'rgba(360, 360, 360, 0.5)',
  //        }}>
  //          +++
  //        </div>
  //        <img src={`data:${imageinfos[2].mimetype};base64,${imageinfos[2].data}`} style={{
  //         objectFit:'scale-down'
  //       }}/>
  //      </div>

  //     </div>
  //   </div>
  // )
}

function Blog({blog, isCreatedByCurrentUser}) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  console.log(blog);

  return (
    <Card sx={{ maxWidth: 245 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        subheader="September 14, 2016"
      />

      <ImagesSection imageinfos={blog.imageinfos}/>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {blog.text}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
            aside for 10 minutes.
          </Typography>
          <Typography paragraph>
            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
            medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
            occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a
            large plate and set aside, leaving chicken and chorizo in the pan. Add
            pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook,
            stirring often until thickened and fragrant, about 10 minutes. Add
            saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
          </Typography>
          <Typography paragraph>
            Add rice and stir very gently to distribute. Top with artichokes and
            peppers, and cook without stirring, until most of the liquid is absorbed,
            15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
            mussels, tucking them down into the rice, and cook again without
            stirring, until mussels have opened and rice is just tender, 5 to 7
            minutes more. (Discard any mussels that don&apos;t open.)
          </Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default Blog