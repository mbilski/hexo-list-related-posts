var assign = require('lodash.assign');

function objectArrayIndexOf(array, searchTerm, property) {
  for(var i = 0; i < array.length; i++){
    if (array[i][property] === searchTerm) return i;
  }
  return -1;
}

function tagsFor(post) {
  var tags = [];
  post.tags.each(function(tag){
    tags.push(tag.name);
  })
  return tags;
}

function common(la, lb) {
  var ret = 0;
  for (var a in la) {
    if (lb.indexOf(la[a]) != -1) {
      ret++;
    }
  }
  return ret;
}

function sortBySimilarTags(tags) {
  return function(a, b) {
    var ret = common(tagsFor(b), tags) - common(tagsFor(a), tags);
    return ret == 0 ? 0 : ret > 0 ? 1 : -1;
  };
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function listRelatedPosts(post, options) {
  if (!options) {
    options = {};
  }

  options = assign({
    maxCount: 2,
    ulClass: 'related-posts',
    liClass: 'related-posts-item',
    orderBy: 'date',
    isAscending: false
  }, options);

  var postList = [];
  post.categories.each(function(category){
    category.posts.each(function(post){
      postList.push(post);
    });
  });

  var thisPostPosition = objectArrayIndexOf(postList, post._id, '_id');
  postList.splice(thisPostPosition, 1);
  postList.sort(sortBySimilarTags(tagsFor(post)));

  var result = '';
  var root = this.config.root;
  var count = Math.min(options.maxCount, postList.length);

  if(count !== 0){
    result += '<h3>Related posts</h3>';
    result += '<ul class="' + options.ulClass + '">';
    for (var i = 0; i < count; i++) {
      result += '<li class="' + options.liClass + '">' + 
      '<a href="' + root + postList[i].path + '">' + 
      postList[i].title + '</a>' + postList[i].excerpt + '</li>';
    }
  }

  return result;
}

hexo.extend.helper.register('list_related_posts', listRelatedPosts);
