import React from 'react'
import Card from '../primitives/Card';
const data = [
  {
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", // Wild horses
    cumbTitle: "Design Conference",
    subHeading: "Design Thinking",
    Title: "Wild Horse Event",
    ctaLink: "https://sfdesignweek.org/"
  },
  {
    url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80", // Music concert
    cumbTitle: "Workshop",
    subHeading: "Football",
    Title: "Music & Colors",
    ctaLink: "https://uxbootcamp.com/"
  },
  {
    url: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80", // Father's Day family
    cumbTitle: "Meetup",
    subHeading: "Bootcamp",
    Title: "Happy Fathers Day",
    ctaLink: "https://meetup.com/london-creatives"
  }
];
const EventsComponents = () => {
  return (
    <div className='relative'>
      <h1 className='text-5xl text-center font-bold text-gray-900 mb-20'>
        Design Events Near Your Location
      </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8'>
            {
                data.map((event, index) => {
                    return <Card title={event.Title} 
                    ctaLink={event.ctaLink} 
                    crumbTitle={event.cumbTitle}  
                    subHeading={event.subHeading}
                    url={event.url}
                    key={index}
                    />
                }) 
                
        }
        </div>
    </div>
  )
}

export default EventsComponents
