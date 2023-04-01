import { tweetsData as data } from './data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let tweetsData = data;

if(localStorage.getItem('storedTweetsData')) {
    tweetsData = JSON.parse(localStorage.getItem('storedTweetsData'));
}

document.addEventListener('click', function(e) {
        if(e.target.dataset.like) {
            handleLikeClick(e.target.dataset.like);
        } else if(e.target.dataset.retweet) {
            handleRetweetClick(e.target.dataset.retweet);
        } else if(e.target.dataset.reply){
            handleReplyClick(e.target.dataset.reply)
        } else if(e.target.id === 'tweet-btn') {
            handleTweetBtnClick();
        } else if(e.target.id === 'reply-button') {
            handleReplyBtnClick(e.target.dataset.replyBtn);
        }
});


function handleLikeClick(tweetId) {
    const targetTweetObj = tweetsData.filter(function(tweet) {
        return tweet.uuid === tweetId;
    })[0];
    if(targetTweetObj.isLiked){
        targetTweetObj.likes--;
    } else{
        targetTweetObj.likes++;
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked;
    render();
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet) {
        return tweet.uuid === tweetId;
    })[0];
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--;
    } else{
        targetTweetObj.retweets++;
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
    render();
}

function handleReplyClick(tweetId) {
    const replyEl = document.querySelector(`#replies-${tweetId}`);
    const replyArea = document.querySelector(`#reply-${tweetId}`);
    replyEl.classList.toggle('hidden');
    replyArea.classList.toggle('hidden');
}

function handleReplyBtnClick(tweetId) {
    const reply = document.querySelector(`#reply-input-${tweetId}`).value;
    if(reply){
        const parentTweet = tweetsData.filter(function(tweet) {
            return tweet.uuid === tweetId;
        })[0]
        parentTweet.replies.push({
            handle: `@web3_pastel`,
            profilePic: `images/pfp.png`,
            tweetText: `${reply}`
        })
        render();
    }
}

function handleTweetBtnClick() {
    const tweetInput = document.querySelector('#tweet-input');

    if(tweetInput.value) {
        tweetsData.unshift({
            handle: `@web3_pastel`,
            profilePic: `images/pfp.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        });
        tweetInput.value = "";
        render();
    }
}

function getFeedHtml() {
    let feedHtml = ``;
    tweetsData.forEach(function(tweet) {

        let likeIconClass = '';
        let retweetIconClass = '';

        if(tweet.isLiked) {
            likeIconClass = 'liked';
        }

        if(tweet.isRetweeted) {
            retweetIconClass = 'retweeted';
        }

        let repliesHtml = ``;

        if(tweet.replies.length > 0) {
            tweet.replies.forEach(function(reply) {
                repliesHtml += `
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                </div>
                `
            });
        }

        feedHtml += `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                                ${tweet.retweets}
                            </span>
                        </div>   
                    </div>            
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    ${repliesHtml}
                </div>
                <div class="reply-holder hidden" id="reply-${tweet.uuid}">
                    <textarea class="reply-input" id="reply-input-${tweet.uuid}"></textarea>
                    <button class="reply-button" id="reply-button" data-reply-btn= "${tweet.uuid}">Reply</button>
                </div>
            </div>
        `
    });
    return feedHtml;
}

function render() {
    document.querySelector('#feed').innerHTML = getFeedHtml();
    localStorage.setItem('storedTweetsData',JSON.stringify(tweetsData));
}

render();
