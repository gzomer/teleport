# Teleport

Teleport is an interactive virtual reality experience. You travel around the world by simple saying voice commands and choosing your next destination or experiences.

The app understands what you are saying by using Wit.AI speech recognition and its advanced NLP features.

Here is a list of the support commands:

Travel around the world
- Take me to Rome
- Show me next attraction
- Tell me about this experience
- Show me a famous painting

Experience new adventures
- Take me to the Everest
- Show me the wildlife
- I want to scuba diving

Social features
- Invite my friend **friend name**
- End call

Booking a trip
- Book a trip to Australia in August
- Choose the first option
- Confirm payment
- End booking

Control the VR experience
- Pause
- Resume

## How I built it

I have used VideoJS, ThreeJS, VideoJS-VR, and the Web Device Orientation API to build the virtual reality experience.

The Web Audio Analyser API was used to detect when the user started and stopped speaking.

Finally, the Wit.AI speech recognition and its NLP features were used to detect the user intents.

## Challenges I ran into

Detecting when the user started and stopped speaking was one of the main challenges. It was necessary because otherwise I wouldn't be able to correctly identify the voice commands, as the Wit.AI API expects an audio file with 10 seconds in length.

I have tried different approaches, and the final solution was to use an always-on volume change detector using the Audio Analyse API that triggered when the volume raised and down to mark when the user is speaking or not.

## Accomplishments that I'm proud of

I'm proud of the immersive experience and the simple user interface I was able to create by mixing VR + Wit.AI speech recognition and NLP features. The final product is simple to use, yet powerful, immersive and engaging.

## What I learned
It was a great learning opportunity to learn how to:

- Detect user intents from audio using Wit.AI
- Detect user intents from text using Wit.AI
- Use 360º videos formats and viewing
- View virtual reality videos on the web
- Use Web Audio API to record users audio
- Use Web Analyse API to detect changes in users microphone volume level
- Use Web Device orientation to read users device orientation

## What's next for Teleport - reinventing travel for the new world

There are many exciting things to do in the next version:

- Add more places and videos
- Add more experiences
- Add search features
- Allow multi-users call
- Take a picture and share it with your friends

## Credits

- Rome video - https://www.youtube.com/watch?v=1ziMH_lAUW0
- Sistine Chapel - https://www.youtube.com/watch?v=7jHygRhvHss
- Everest - https://www.youtube.com/watch?v=7g2k0eEQUaM
- Scuba Diving - https://www.youtube.com/watch?v=mG-A_Tj23B4
- World - https://www.youtube.com/watch?v=dwHBpykTloY
- Icon - https://www.flaticon.com/free-icon/travel_2798100
