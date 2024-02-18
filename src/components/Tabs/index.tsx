import React, { useState } from 'react'

interface TabsProps {
  tabs: {
    id: string
    label: string
    content: React.ReactNode
  }[]
  activeTab: string
  setActiveTab: (tabId: string) => void
}

const useTabs = (tab: string) => {
  const [activeTab, setActiveTab] = useState(tab)
  return {
    activeTab,
    setActiveTab,
  }
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => {
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
  }

  return (
    <div>
      <div>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            style={{
              fontWeight: tab.id === activeTab ? 'bold' : 'normal',
              backgroundColor: tab.id === activeTab ? 'lightblue' : 'white',
              marginRight: '10px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* <div>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            style={{ display: tab.id === activeTab ? 'block' : 'none' }}
          >
            {tab.content}
          </div>
        ))}
      </div> */}
    </div>
  )
}

export { Tabs, useTabs }
