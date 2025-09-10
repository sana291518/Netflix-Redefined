export const MovieRowProps = {
  
  Item: {
    id: Number,
    name: String, 
    title: String, 
    overview: String,
    media_type: String, 
    poster_path: String,
  },

  // Type for onOpenDetails callback parameter
  onOpenDetails: {
    id: Number,
    media_type: String, 
    title: String,
  },

  // Props shape for the MovieRow component
  Default: {
    title: String,
    onOpenDetails: Function, 
    items: Array, 
  },
};
