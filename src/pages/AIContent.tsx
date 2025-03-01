import React, { useState } from 'react';
import { 
  Image, 
  Upload, 
  Instagram, 
  Facebook, 
  Twitter, 
  Copy, 
  Download, 
  Trash2, 
  Plus,
  RefreshCw,
  Check
} from 'lucide-react';

const AIContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('workout-images');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Mock generated images
  const mockImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      title: 'Morning Workout Routine',
      date: '2023-06-10',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      title: 'Strength Training Session',
      date: '2023-06-08',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      title: 'Cardio Workout',
      date: '2023-06-05',
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
      title: 'Yoga Session',
      date: '2023-06-03',
    },
  ];
  
  // Mock social media posts
  const mockPosts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      caption: 'Start your day with energy! 💪 Our morning workout classes are designed to boost your metabolism and set a positive tone for the day. #MorningWorkout #FitnessGoals',
      platforms: ['instagram', 'facebook'],
      date: '2023-06-10',
      status: 'scheduled',
      scheduledFor: '2023-06-15 09:00 AM',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      caption: 'Build strength, build confidence. 💯 Our strength training programs are tailored to help you achieve your personal goals. #StrengthTraining #FitnessJourney',
      platforms: ['instagram', 'twitter'],
      date: '2023-06-08',
      status: 'published',
      publishedAt: '2023-06-08 02:30 PM',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      caption: 'Cardio doesn\'t have to be boring! 🏃‍♀️ Mix up your routine with our high-energy cardio classes. #CardioWorkout #HeartHealth',
      platforms: ['instagram', 'facebook', 'twitter'],
      date: '2023-06-05',
      status: 'published',
      publishedAt: '2023-06-05 11:15 AM',
    },
  ];
  
  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };
  
  const tabs = [
    { id: 'workout-images', label: 'Workout Images' },
    { id: 'social-posts', label: 'Social Media Posts' },
    { id: 'templates', label: 'Templates' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">AI Content Generator</h1>
      </div>
      
      {/* Tabs */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="p-6">
          {activeTab === 'workout-images' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300">
                <h3 className="text-lg font-medium mb-4">Generate Workout Images</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload photos of your gym and models to generate custom workout images for your marketing materials.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gym Photos
                    </label>
                    <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                      <span className="flex items-center space-x-2">
                        <Upload className="w-6 h-6 text-gray-600" />
                        <span className="font-medium text-gray-600">
                          Drop files to upload or browse
                        </span>
                      </span>
                      <input type="file" name="file_upload" className="hidden" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload up to 5 photos of your gym environment
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model Photos (Optional)
                    </label>
                    <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                      <span className="flex items-center space-x-2">
                        <Upload className="w-6 h-6 text-gray-600" />
                        <span className="font-medium text-gray-600">
                          Drop files to upload or browse
                        </span>
                      </span>
                      <input type="file" name="file_upload" className="hidden" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload photos of models or trainers (with permission)
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workout Type
                  </label>
                  <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                    <option>Strength Training</option>
                    <option>Cardio</option>
                    <option>Yoga</option>
                    <option>HIIT</option>
                    <option>CrossFit</option>
                    <option>Pilates</option>
                  </select>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Instructions (Optional)
                  </label>
                  <textarea 
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    rows={3}
                    placeholder="Describe the specific workout, atmosphere, or style you want to generate..."
                  ></textarea>
                </div>
                
                <div className="mt-6">
                  <button
                    className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Image className="w-4 h-4 mr-2" />
                        Generate Images
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Generated Images */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Generated Images</h3>
                  <div className="flex space-x-2">
                    <select className="px-3 py-1 text-sm border rounded-md">
                      <option>Most Recent</option>
                      <option>Oldest</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mockImages.map((image) => (
                    <div 
                      key={image.id} 
                      className={`relative group rounded-lg overflow-hidden border ${
                        selectedImage === image.url ? 'border-primary' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedImage(image.url)}
                    >
                      <img 
                        src={image.url} 
                        alt={image.title} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t">
                        <h4 className="text-sm font-medium truncate">{image.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{new Date(image.date).toLocaleDateString()}</p>
                      </div>
                      {selectedImage === image.url && (
                        <div className="absolute top-2 right-2 p-1 bg-primary rounded-full">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {selectedImage && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    <button className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                    <button className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </button>
                    <button className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
                      <Instagram className="w-4 h-4 mr-2" />
                      Share to Instagram
                    </button>
                    <button className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
                      <Facebook className="w-4 h-4 mr-2" />
                      Share to Facebook
                    </button>
                    <button className="inline-flex items-center px-3 py-2 bg-white border border-red-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'social-posts' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300">
                <h3 className="text-lg font-medium mb-4">Generate Social Media Posts</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Create engaging social media posts with motivational quotes and fitness tips.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Image
                    </label>
                    <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                      <option value="">Select a generated image</option>
                      {mockImages.map((image) => (
                        <option key={image.id} value={image.id}>
                          {image.title}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Or upload a new image
                    </p>
                    <div className="mt-2 flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                      <span className="flex items-center space-x-2">
                        <Upload className="w-6 h-6 text-gray-600" />
                        <span className="font-medium text-gray-600">
                          Drop files to upload or browse
                        </span>
                      </span>
                      <input type="file" name="file_upload" className="hidden" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Post Type
                    </label>
                    <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                      <option>Motivational Quote</option>
                      <option>Workout Tip</option>
                      <option>Nutrition Advice</option>
                      <option>Member Spotlight</option>
                      <option>Class Promotion</option>
                      <option>Special Offer</option>
                    </select>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Platforms
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input 
                            id="instagram" 
                            type="checkbox" 
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            defaultChecked
                          />
                          <label htmlFor="instagram" className="ml-2 block text-sm text-gray-700">
                            Instagram
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            id="facebook" 
                            type="checkbox" 
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            defaultChecked
                          />
                          <label htmlFor="facebook" className="ml-2 block text-sm text-gray-700">
                            Facebook
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            id="twitter" 
                            type="checkbox" 
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor="twitter" className="ml-2 block text-sm text-gray-700">
                            Twitter
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Instructions (Optional)
                  </label>
                  <textarea 
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    rows={3}
                    placeholder="Describe the tone, style, or specific message you want to convey..."
                  ></textarea>
                </div>
                
                <div className="mt-6">
                  <button
                    className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Generate Post
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Generated Posts */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Generated Posts</h3>
                  <div className="flex space-x-2">
                    <select className="px-3 py-1 text-sm border rounded-md">
                      <option>All Platforms</option>
                      <option>Instagram</option>
                      <option>Facebook</option>
                      <option>Twitter</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {mockPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3">
                          <img 
                            src={post.image} 
                            alt="Post" 
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </div>
                        <div className="p-4 md:w-2/3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {post.platforms.includes('instagram') && (
                                <Instagram className="w-4 h-4 text-gray-600" />
                              )}
                              {post.platforms.includes('facebook') && (
                                <Facebook className="w-4 h-4 text-gray-600" />
                              )}
                              {post.platforms.includes('twitter') && (
                                <Twitter className="w-4 h-4 text-gray-600" />
                              )}
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              post.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {post.status === 'published' ? 'Published' : 'Scheduled'}
                            </span>
                          </div>
                          <p className="text-sm mb-4">{post.caption}</p>
                          <div className="flex items-center text-xs text-gray-500 mb-4">
                            <span className="mr-4">Created: {new Date(post.date).toLocaleDateString()}</span>
                            {post.status === 'published' ? (
                              <span>Published: {post.publishedAt}</span>
                            ) : (
                              <span>Scheduled for: {post.scheduledFor}</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button className="inline-flex items-center px-3 py-1 bg-white border border-gray-300 rounded-md text-xs font-medium hover:bg-gray-50">
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </button>
                            <button className="inline-flex items-center px-3 py-1 bg-white border border-gray-300 rounded-md text-xs font-medium hover:bg-gray-50">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </button>
                            {post.status === 'scheduled' ? (
                              <button className="inline-flex items-center px-3 py-1 bg-primary text-white rounded-md text-xs font-medium">
                                <Check className="w-3 h-3 mr-1" />
                                Publish Now
                              </button>
                            ) : (
                              <button className="inline-flex items-center px-3 py-1 bg-white border border-gray-300 rounded-md text-xs font-medium hover:bg-gray-50">
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Repost
                              </button>
                            )}
                            <button className="inline-flex items-center px-3 py-1 bg-white border border-red-300 rounded-md text-xs font-medium text-red-600 hover:bg-red-50">
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Content Templates</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Save time by using pre-designed templates for common gym marketing needs.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all">
                    <div className="h-40 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-sm font-medium">New Class Announcement</h4>
                    <p className="text-xs text-gray-500 mt-1">Template for promoting new classes or programs</p>
                    <button className="mt-3 w-full px-3 py-1 bg-primary text-white rounded-md text-xs font-medium">
                      Use Template
                    </button>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all">
                    <div className="h-40 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-sm font-medium">Motivational Monday</h4>
                    <p className="text-xs text-gray-500 mt-1">Weekly motivation post with inspiring quotes</p>
                    <button className="mt-3 w-full px-3 py-1 bg-primary text-white rounded-md text-xs font-medium">
                      Use Template
                    </button>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all">
                    <div className="h-40 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-sm font-medium">Membership Promotion</h4>
                    <p className="text-xs text-gray-500 mt-1">Special offers and membership discounts</p>
                    <button className="mt-3 w-full px-3 py-1 bg-primary text-white rounded-md text-xs font-medium">
                      Use Template
                    </button>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all">
                    <div className="h-40 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-sm font-medium">Transformation Tuesday</h4>
                    <p className="text-xs text-gray-500 mt-1">Showcase member success stories and transformations</p>
                    <button className="mt-3 w-full px-3 py-1 bg-primary text-white rounded-md text-xs font-medium">
                      Use Template
                    </button>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all">
                    <div className="h-40 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-sm font-medium">Workout of the Day</h4>
                    <p className="text-xs text-gray-500 mt-1">Daily workout challenges and routines</p>
                    <button className="mt-3 w-full px-3 py-1 bg-primary text-white rounded-md text-xs font-medium">
                      Use Template
                    </button>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all">
                    <div className="h-40 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                      <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-sm font-medium">Create Custom Template</h4>
                    <p className="text-xs text-gray-500 mt-1">Design your own template for future use</p>
                    <button className="mt-3 w-full px-3 py-1 bg-primary text-white rounded-md text-xs font-medium">
                      Create New
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <Info className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Premium Feature</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Unlock unlimited AI-generated content and premium templates with our Pro plan.
                      </p>
                      <button className="mt-3 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium">
                        Upgrade to Pro
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIContent;