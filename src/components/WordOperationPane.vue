<template>
    <div class="word-operation-pane">
        <a-button-group>
            <a-tooltip title="撤销(Ctrl+Z)" placement="bottom">
                <a-button @click="btnUndoWord" type="text" shape="circle" :icon="h(UndoOutlined)" />
            </a-tooltip>
            <a-tooltip title="重做(Ctrl+Y)" placement="bottom">
                <a-button @click="btnRedoWord" type="text" shape="circle" :icon="h(RedoOutlined)" />
            </a-tooltip>
            <a-tooltip title="格式刷(双击可连续使用)" placement="bottom">
                <a-button @click="btnBoldWord" type="text" shape="circle" :icon="h(FormatPainterOutlined)" />
            </a-tooltip>
            <a-tooltip title="清除格式" placement="bottom">
                <a-button @click="btnFormatWord" type="text" shape="circle" :icon="h(ClearOutlined)" />
            </a-tooltip>
            <a-dropdown trigger="click">
                <a-tooltip title="字体" placement="bottom">
                    <a-button type="text"
                        :style="{ fontFamily: WORD_FONT_MAP.find(item => item.value === currentFont).value }">
                        {{WORD_FONT_MAP.find(item => item.value === currentFont).name}}
                        <DownOutlined />
                    </a-button>
                </a-tooltip>
                <template #overlay>
                    <a-menu>
                        <a-menu-item v-for="item in WORD_FONT_MAP" :key="item.value">
                            <a-button @click="btnFontWord(item.value)" type="text"
                                :style="{ fontFamily: item.value }">{{
                                    item.name }}</a-button>
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
            <a-dropdown trigger="click">
                <a-tooltip title="字号" placement="bottom">
                    <a-button type="text">
                        {{WORD_FONT_SIZE_MAP.find(item => item.value === currentFontSize) ?
                            WORD_FONT_SIZE_MAP.find(item => item.value === currentFontSize).name : currentFontSize}}
                        <DownOutlined />
                    </a-button>
                </a-tooltip>
                <template #overlay>
                    <a-menu>
                        <a-menu-item v-for="item in WORD_FONT_SIZE_MAP" :key="item.value">
                            <a-button @click="btnFontSizeWord(item.value)" type="text">{{ item.name }}</a-button>
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
            <a-tooltip title="增大字号(Ctrl+[)" placement="bottom">
                <a-button @click="btnSizeAddWord" type="text" shape="circle" :icon="h(PlusOutlined)" />
            </a-tooltip>
            <a-tooltip title="减小字号(Ctrl+])" placement="bottom">
                <a-button @click="btnSizeMinusWord" type="text" shape="circle" :icon="h(MinusOutlined)" />
            </a-tooltip>
            <a-tooltip title="加粗(Ctrl+B)" placement="bottom">
                <a-button @click="btnBoldWord" type="text" shape="circle" :icon="h(BoldOutlined)" />
            </a-tooltip>
            <a-tooltip title="斜体(Ctrl+I)" placement="bottom">
                <a-button @click="btnItalicWord" type="text" shape="circle" :icon="h(ItalicOutlined)" />
            </a-tooltip>
            <a-tooltip title="下划线(Ctrl+U)" placement="bottom">
                <a-button @click="btnUnderlineWord" type="text" shape="circle" :icon="h(UnderlineOutlined)" />
            </a-tooltip>
            <a-tooltip title="删除线(Ctrl+Shift+X)" placement="bottom">
                <a-button @click="btnStrikeoutWord" type="text" shape="circle" :icon="h(StrikethroughOutlined)" />
            </a-tooltip>
            <a-tooltip title="上标(Ctrl+Shift+,)" placement="bottom">
                <a-button @click="btnSuperscriptWord" type="text" shape="circle">
                    <icon :style="{ color: 'hotpink' }">
                        <template #component>
                            <svg t="1770801832276" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="1586" width="16" height="16">
                                <path
                                    d="M406.831 532l221.97-317.005-65.533-45.886L358 462.262 152.732 169.11 87.2 214.995 309.169 532 87.199 849.005l65.533 45.886L358 601.738 563.268 894.89l65.532-45.886L406.831 532z m554.63-106H704c0.36-29.244 7.9-54.79 22.622-76.639 14.723-21.849 34.83-40.84 60.326-56.974 12.209-8.404 24.956-16.555 38.242-24.454 13.286-7.9 25.495-16.387 36.626-25.462 11.132-9.076 20.288-18.908 27.47-29.496 7.182-10.588 10.952-22.773 11.311-36.555 0-6.386-0.808-13.193-2.424-20.42-1.616-7.227-4.758-13.95-9.426-20.168-4.668-6.219-11.131-11.429-19.39-15.63-8.259-4.202-19.031-6.303-32.317-6.303-12.21 0-22.353 2.269-30.432 6.807-8.08 4.538-14.543 10.756-19.39 18.655-4.849 7.9-8.44 17.227-10.773 27.984-2.334 10.756-3.68 22.352-4.04 34.79h-61.403c0-19.496 2.783-37.563 8.349-54.202 5.566-16.639 13.914-31.009 25.046-43.11 11.131-12.1 24.686-21.596 40.666-28.487C801.042 69.446 819.624 66 840.81 66c22.981 0 42.192 3.53 57.633 10.588 15.44 7.06 27.918 15.967 37.434 26.723 9.516 10.756 16.248 22.437 20.198 35.042 3.95 12.605 5.925 24.622 5.925 36.05 0 14.118-2.334 26.891-7.002 38.32-4.668 11.428-10.952 21.932-18.852 31.512-7.9 9.58-16.877 18.404-26.931 26.47a401.632 401.632 0 0 1-31.24 22.69 848.213 848.213 0 0 1-32.317 20.168c-10.773 6.387-20.737 12.773-29.894 19.16-9.157 6.386-17.146 13.025-23.969 19.916-6.822 6.89-11.49 14.201-14.004 21.932h183.67V426z"
                                    p-id="1587"></path>
                            </svg>
                        </template>
                    </icon>
                </a-button>
            </a-tooltip>
            <a-tooltip title="下标(Ctrl+Shift+,)" placement="bottom">
                <a-button @click="btnSubscriptWord" type="text" shape="circle">
                    <icon :style="{ color: 'hotpink' }">
                        <template #component>
                            <svg t="1770802563246" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="2742" width="16" height="16">
                                <path
                                    d="M238.762667 170.666667L448 423.594667 657.237333 170.666667H768l-264.618667 319.872L768 810.410667V810.666667h-110.506667l-209.493333-253.184L238.506667 810.666667H128v-0.256l264.618667-319.872L128 170.666667h110.762667zM919.466667 707.413333a34.133333 34.133333 0 1 0-56.32-15.36l-49.28 14.08a85.333333 85.333333 0 1 1 140.714666 38.570667L885.077333 810.666667H981.333333v42.666666h-170.666666v-42.666666l108.8-103.253334z"
                                    p-id="2743"></path>
                            </svg>
                        </template>
                    </icon>
                </a-button>
            </a-tooltip>
            <a-popover trigger="click" placement="bottom">
                <template #content>
                    <ChromePicker v-model="fontColor" />
                </template>
                <a-tooltip title="字体颜色" placement="bottom">
                    <a-button type="text" shape="circle" :icon="h(FontColorsOutlined)" />
                </a-tooltip>
            </a-popover>
            <a-popover trigger="click" placement="bottom">
                <template #content>
                    <TwitterPicker v-model="highlightColor" />
                </template>
                <a-tooltip title="高亮" placement="bottom">
                    <a-button type="text" shape="circle" :icon="h(HighlightOutlined)" />
                </a-tooltip>
            </a-popover>
            <a-popover trigger="click" placement="bottom">
                <template #content>
                    <a-menu>
                        <a-menu-item @click="btnTitleWord()" :key="0">
                            <a-tooltip title="Ctrl+Alt+0" placement="bottom">
                                正文
                            </a-tooltip>
                        </a-menu-item>
                        <a-menu-item @click="btnTitleWord(TitleLevel.FIRST)" :key="1">
                            <a-tooltip title="Ctrl+Alt+1" placement="bottom">
                                标题1
                            </a-tooltip>
                        </a-menu-item>
                        <a-menu-item @click="btnTitleWord(TitleLevel.SECOND)" :key="2">
                            <a-tooltip title="Ctrl+Alt+2" placement="bottom">
                                标题2
                            </a-tooltip>
                        </a-menu-item>
                        <a-menu-item @click="btnTitleWord(TitleLevel.THIRD)" :key="3">
                            <a-tooltip title="Ctrl+Alt+3" placement="bottom">
                                标题3
                            </a-tooltip>
                        </a-menu-item>
                        <a-menu-item @click="btnTitleWord(TitleLevel.FOURTH)" :key="4">
                            <a-tooltip title="Ctrl+Alt+4" placement="bottom">
                                标题4
                            </a-tooltip>
                        </a-menu-item>
                        <a-menu-item @click="btnTitleWord(TitleLevel.FIFTH)" :key="5">
                            <a-tooltip title="Ctrl+Alt+5" placement="bottom">
                                标题5
                            </a-tooltip>
                        </a-menu-item>
                        <a-menu-item @click="btnTitleWord(TitleLevel.SIXTH)" :key="6">
                            <a-tooltip title="Ctrl+Alt+6" placement="bottom">
                                标题6
                            </a-tooltip>
                        </a-menu-item>
                    </a-menu>
                </template>
                <a-tooltip title="标题" placement="bottom">
                    <a-button type="text" shape="circle">
                        <icon :style="{ color: 'hotpink' }">
                            <template #component>
                                <svg t="1770862292554" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="2557" width="16" height="16">
                                    <path
                                        d="M308.623635 461.155909h406.75273v-355.90864a50.844091 50.844091 0 1 1 101.688183 0v813.505462a50.844091 50.844091 0 0 1-101.688183 0v-355.90864h-406.75273v355.90864a50.844091 50.844091 0 0 1-101.688183 0v-813.505462a50.844091 50.844091 0 0 1 101.688183 0z"
                                        fill="#303030" p-id="2558"></path>
                                </svg>
                            </template>
                        </icon>
                    </a-button>
                </a-tooltip>
            </a-popover>
            <a-tooltip title="左对齐(Ctrl+L)" placement="bottom">
                <a-button @click="btnRowFlexWord(RowFlex.LEFT)" type="text" shape="circle"
                    :icon="h(AlignLeftOutlined)" />
            </a-tooltip>
            <a-tooltip title="居中对齐(Ctrl+E)" placement="bottom">
                <a-button @click="btnRowFlexWord(RowFlex.CENTER)" type="text" shape="circle"
                    :icon="h(AlignCenterOutlined)" />
            </a-tooltip>
            <a-tooltip title="右对齐(Ctrl+R)" placement="bottom">
                <a-button @click="btnRowFlexWord(RowFlex.RIGHT)" type="text" shape="circle"
                    :icon="h(AlignRightOutlined)" />
            </a-tooltip>
            <a-tooltip title="两端对齐(Ctrl+J)" placement="bottom">
                <a-button @click="btnRowFlexWord(RowFlex.ALIGNMENT)" type="text" shape="circle">
                    <icon :style="{ color: 'hotpink' }">
                        <template #component>
                            <svg t="1770802642377" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="3841" width="16" height="16">
                                <path d="M0 93.090909h1024v93.137455H0z" fill="#231815" p-id="3842"></path>
                                <path d="M0 332.334545h1024v93.09091H0z" fill="#231815" p-id="3843"></path>
                                <path d="M0 810.821818h1024v93.090909H0z" fill="#231815" p-id="3844"></path>
                                <path d="M0 571.578182h1024v93.090909H0z" fill="#231815" p-id="3845"></path>
                            </svg>
                        </template>
                    </icon>
                </a-button>
            </a-tooltip>
            <a-tooltip title="分散对齐(Ctrl+Shift+J)" placement="bottom">
                <a-button @click="btnRowFlexWord(RowFlex.JUSTIFY)" type="text" shape="circle">
                    <icon :style="{ color: 'hotpink' }">
                        <template #component>
                            <svg t="1770803849747" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="4947" width="16" height="16">
                                <path
                                    d="M113.777778 568.888889m42.666666 0l711.111112 0q42.666667 0 42.666666 42.666667l0 0q0 42.666667-42.666666 42.666666l-711.111112 0q-42.666667 0-42.666666-42.666666l0 0q0-42.666667 42.666666-42.666667Z"
                                    fill="#404040" p-id="4948"></path>
                                <path
                                    d="M113.777778 796.444444m42.666666 0l711.111112 0q42.666667 0 42.666666 42.666667l0 0q0 42.666667-42.666666 42.666667l-711.111112 0q-42.666667 0-42.666666-42.666667l0 0q0-42.666667 42.666666-42.666667Z"
                                    fill="#404040" p-id="4949"></path>
                                <path
                                    d="M903.736889 256.512l-134.542222-110.136889a18.090667 18.090667 0 0 0-29.639111 13.653333v220.330667a18.090667 18.090667 0 0 0 29.639111 13.710222l134.542222-110.193777a17.635556 17.635556 0 0 0 0-27.363556z"
                                    fill="#404040" p-id="4950"></path>
                                <path
                                    d="M568.888889 241.834667m28.444444 0l170.666667 0q28.444444 0 28.444444 28.444444l0 0q0 28.444444-28.444444 28.444445l-170.666667 0q-28.444444 0-28.444444-28.444445l0 0q0-28.444444 28.444444-28.444444Z"
                                    fill="#404040" p-id="4951"></path>
                                <path
                                    d="M120.263111 256.512l134.542222-110.136889a18.090667 18.090667 0 0 1 29.639111 13.653333v220.330667a18.090667 18.090667 0 0 1-29.639111 13.710222L120.263111 283.875556a17.635556 17.635556 0 0 1 0-27.363556z"
                                    fill="#404040" p-id="4952"></path>
                                <path
                                    d="M227.555556 241.777778m28.444444 0l170.666667 0q28.444444 0 28.444444 28.444444l0 0q0 28.444444-28.444444 28.444445l-170.666667 0q-28.444444 0-28.444444-28.444445l0 0q0-28.444444 28.444444-28.444444Z"
                                    fill="#404040" p-id="4953"></path>
                            </svg>
                        </template>
                    </icon>
                </a-button>
            </a-tooltip>
            <a-popover trigger="click" placement="bottom">
                <template #content>
                    <a-menu>
                        <a-menu-item @click="btnRowMarginWord(1)" :key="1">
                            1
                        </a-menu-item>
                        <a-menu-item @click="btnRowMarginWord(1.25)" :key="1.25">
                            1.25
                        </a-menu-item>
                        <a-menu-item @click="btnRowMarginWord(1.5)" :key="1.5">
                            1.5
                        </a-menu-item>
                        <a-menu-item @click="btnRowMarginWord(1.75)" :key="1.75">
                            1.75
                        </a-menu-item>
                        <a-menu-item @click="btnRowMarginWord(2)" :key="2">
                            2
                        </a-menu-item>
                        <a-menu-item @click="btnRowMarginWord(2.5)" :key="2.5">
                            2.5
                        </a-menu-item>
                        <a-menu-item @click="btnRowMarginWord(3)" :key="3">
                            3
                        </a-menu-item>
                    </a-menu>
                </template>
                <a-tooltip title="行间距" placement="bottom">
                    <a-button type="text" shape="circle">
                        <icon :style="{ color: 'hotpink' }">
                            <template #component>
                                <svg t="1770804210875" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="8017" width="16" height="16">
                                    <path
                                        d="M409.088 232.448h489.984v77.824H409.088V232.448z m0 243.2h489.984v77.824H409.088V475.648z m0 243.2h489.984v77.824H409.088v-77.824zM274.432 292.352h72.192L235.52 181.76 124.928 292.352h71.68v439.296h-71.68L235.52 842.24l111.104-110.592H274.432z"
                                        p-id="8018"></path>
                                </svg>
                            </template>
                        </icon>
                    </a-button>
                </a-tooltip>
            </a-popover>
            <a-popover trigger="click" placement="bottom">
                <template #content>
                    <a-menu>
                        <a-menu-item @click="btnInsertListWord()" :key="0">
                            取消列表
                        </a-menu-item>
                        <a-menu-item @click="btnInsertListWord(ListType.OL)" :key="1">
                            有序列表
                        </a-menu-item>
                        <a-menu-item @click="btnInsertListWord(ListType.UL, ListStyle.CHECKBOX)" :key="2">
                            复选框列表
                        </a-menu-item>
                        <a-menu-item @click="btnInsertListWord(ListType.UL, ListStyle.DECIMAL)" :key="3">
                            实心原点列表
                        </a-menu-item>
                        <a-menu-item @click="btnInsertListWord(ListType.UL, ListStyle.CIRCLE)" :key="4">
                            空心原点列表
                        </a-menu-item>
                        <a-menu-item @click="btnInsertListWord(ListType.UL, ListStyle.SQUARE)" :key="5">
                            空心方块列表
                        </a-menu-item>
                    </a-menu>
                </template>
                <a-tooltip title="列表(Ctrl+Shift+U)" placement="bottom">
                    <a-button type="text" shape="circle" :icon="h(OrderedListOutlined)" />
                </a-tooltip>
            </a-popover>
            <a-popover trigger="click" placement="bottom">
                <template #content>
                </template>
                <a-tooltip title="表格" placement="bottom">
                    <a-button @click="btnInsertTableWord" type="text" shape="circle" :icon="h(TableOutlined)" />
                </a-tooltip>
            </a-popover>
            <a-tooltip title="图片" placement="bottom">
                <a-button @click="btnInsertImageWord" type="text" shape="circle" :icon="h(FileImageOutlined)" />
            </a-tooltip>
            <a-tooltip title="超链接" placement="bottom">
                <a-button @click="btnHyperlinkWord" type="text" shape="circle" :icon="h(LinkOutlined)" />
            </a-tooltip>
            <a-tooltip title="分割线" placement="bottom">
                <a-button @click="btnSeparatorWord" type="text" shape="circle">
                    <icon :style="{ color: 'hotpink' }">
                        <template #component>
                            <svg t="1770878086865" class="icon" viewBox="0 0 1156 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="2417" width="16" height="16">
                                <path
                                    d="M289.114839 900.954839v123.045161H2.477419v-123.045161z m409.517419 0v123.045161H452.954839v-123.045161z m450.477419 0v123.045161h-286.637419v-123.045161z m0-389.03742v122.88H2.477419V512zM289.114839 0l122.88 147.323871L534.792258 0h81.92l158.637419 153.765161L903.349677 0h81.92L1156.129032 207.277419l-95.876129 76.8-115.612903-144.846451-122.88 147.406451h-81.92L581.037419 132.789677 453.285161 286.637419h-81.92L243.282581 132.789677 87.205161 289.032258 0.330323 202.24l207.194838-202.322581z"
                                    fill="#303030" p-id="2418"></path>
                            </svg>
                        </template>
                    </icon>
                </a-button>
            </a-tooltip>
            <a-popover trigger="click" placement="bottom">
                <template #content>
                    <a-menu>
                        <a-menu-item @click="btnInsertWatermarktWord" :key="0">
                            添加水印
                        </a-menu-item>
                        <a-menu-item @click="btnDeleteWatermarktWord" :key="1">
                            删除水印
                        </a-menu-item>
                    </a-menu>
                </template>
                <a-tooltip title="水印" placement="bottom">
                    <a-button type="text" shape="circle">
                        <icon :style="{ color: 'hotpink' }">
                            <template #component>
                                <svg t="1770879050088" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="5495" width="16" height="16">
                                    <path
                                        d="M823.808 0H200.192C90.112 0 0 90.112 0 200.192v623.616C0 933.888 90.112 1024 200.192 1024h623.616c110.08 0 200.192-90.112 200.192-200.192V200.192C1024 90.112 933.888 0 823.808 0z m97.28 921.088c-26.112 26.112-60.416 40.448-97.28 40.448H200.192c-36.352 0-71.168-14.336-97.28-40.448-26.112-26.112-40.448-60.416-40.448-97.28V200.192c0-36.352 14.336-71.168 40.448-97.28 26.112-26.112 60.416-40.448 97.28-40.448h623.616c36.352 0 71.168 14.336 97.28 40.448 26.112 26.112 40.448 60.416 40.448 97.28v623.616c0 36.352-14.336 71.168-40.448 97.28z"
                                        p-id="5496" fill="#2c2c2c"></path>
                                    <path
                                        d="M229.888 308.224c0-15.36 12.8-28.16 28.16-28.16h219.648v-66.56H258.048c-52.224 0-94.72 42.496-94.72 94.72v400.384c0 52.224 42.496 94.72 94.72 94.72h219.648v-66.56H258.048c-15.36 0-28.16-12.8-28.16-28.16v-166.912h247.808v-66.56H229.888V308.224zM765.952 213.504h-132.096c-52.224 0-94.72 42.496-94.72 94.72v498.688h66.56V308.224c0-15.36 12.8-28.16 28.16-28.16h132.096c15.36 0 28.16 12.8 28.16 28.16v400.384c0 15.36-12.8 28.16-28.16 28.16h-91.648v66.56h91.648c52.224 0 94.72-42.496 94.72-94.72V308.224c0-52.224-42.496-94.72-94.72-94.72z"
                                        p-id="5497" fill="#2c2c2c"></path>
                                </svg>
                            </template>
                        </icon>
                    </a-button>
                </a-tooltip>
            </a-popover>
            <a-tooltip title="代码块" placement="bottom">
                <a-button @click="btnStrikeoutWord" type="text" shape="circle" :icon="h(CodeOutlined)" />
            </a-tooltip>
            <a-tooltip title="复选框" placement="bottom">
                <a-button @click="btnInsertListWord(ListType.UL, ListStyle.CHECKBOX)" type="text" shape="circle"
                    :icon="h(CheckSquareOutlined)" />
            </a-tooltip>
            <a-tooltip title="日期" placement="bottom">
                <a-button @click="btnStrikeoutWord" type="text" shape="circle" :icon="h(ClockCircleOutlined)" />
            </a-tooltip>
            <a-tooltip title="内容块" placement="bottom">
                <a-button @click="btnStrikeoutWord" type="text" shape="circle" :icon="h(ShareAltOutlined)" />
            </a-tooltip>
            <a-tooltip title="搜索与替换" placement="bottom">
                <a-button @click="btnStrikeoutWord" type="text" shape="circle" :icon="h(SearchOutlined)" />
            </a-tooltip>
            <a-tooltip title="打印(Ctrl+P)" placement="bottom">
                <a-button @click="btnPrintWord" type="text" shape="circle" :icon="h(PrinterOutlined)" />
            </a-tooltip>
            <!-- <a-tooltip title="全屏" placement="bottom">
                <a-button @click="toggleFullScreen" type="text" shape="circle" :icon="h(FullscreenOutlined)"
                    v-show="!isFullScreen" />
            </a-tooltip> -->
            <!-- <a-tooltip title="退出全屏" placement="bottom">
                <a-button @click="toggleFullScreen" type="text" shape="circle" :icon="h(FullscreenExitOutlined)"
                    v-show="isFullScreen" />
            </a-tooltip> -->
        </a-button-group>
    </div>
    <a-modal v-model:open="hyperlinkModal" @ok="onOkHyperlinkModal" @cancel="onCancelHyperlinkModal" :closable="false"
        okText="确定" cancelText="取消">
        <a-form :model="hyperlinkForm" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
            autocomplete="off" ref="hyperlinkFormRef">
            <a-form-item label="文本" name="text" :rules="[{ required: true, message: '请输入文本' }]">
                <a-input v-model:value="hyperlinkForm.text" allow-clear />
            </a-form-item>
            <a-form-item label="链接" name="url" :rules="[{ required: true, message: '请输入链接' }]">
                <a-input v-model:value="hyperlinkForm.url" allow-clear>
                    <template #addonBefore>
                        <a-select v-model:value="hyperlinkForm.urlPrefix" style="width: 90px">
                            <a-select-option value="http://">http://</a-select-option>
                            <a-select-option value="https://">https://</a-select-option>
                        </a-select>
                    </template>
                </a-input>
            </a-form-item>
        </a-form>
    </a-modal>
    <a-modal v-model:open="watermarkModal" @ok="onOkWatermarkModal" @cancel="onCancelWatermarkModal" :closable="false"
        okText="确定" cancelText="取消">
        <a-form :model="watermarkForm" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
            autocomplete="off" ref="watermarkFormRef">
            <a-form-item label="内容" name="content" :rules="[{ required: true, message: '请输入内容' }]">
                <a-input v-model:value="watermarkForm.content" allow-clear />
            </a-form-item>
            <a-form-item label="颜色" name="color">
                <a-popover>
                    <template #content>
                        <SketchPicker v-model="watermarkForm.color"></SketchPicker>
                    </template>
                    <a-button :style="{ width: '100%', backgroundColor: watermarkForm.color }"></a-button>
                </a-popover>
            </a-form-item>
            <a-form-item label="大小" name="size">
                <a-slider id="size" v-model:value="watermarkForm.size" :min="10" :max="200" />
            </a-form-item>
            <a-form-item label="透明度" name="opacity">
                <a-slider id="opacity" v-model:value="watermarkForm.opacity" :min="0.1" :max="1" :step="0.1" />
            </a-form-item>
            <a-form-item label="字体" name="font">
                <a-select v-model:value="watermarkForm.font" :size="size">
                    <a-select-option :value="item.value" v-for="item in WORD_FONT_MAP">
                        <span :style="{ fontFamily: item.name }">{{ item.name }}</span>
                    </a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup>
import { h, watch } from 'vue'
import { useFullScreen } from '@/hook/global'
import Icon, {
    UndoOutlined, RedoOutlined, BoldOutlined, ItalicOutlined, UnderlineOutlined, FormatPainterOutlined,
    StrikethroughOutlined, FontColorsOutlined, AlignLeftOutlined, SearchOutlined, ClearOutlined, PlusOutlined,
    AlignCenterOutlined, AlignRightOutlined, OrderedListOutlined, ShareAltOutlined, PrinterOutlined, MinusOutlined,
    TableOutlined, FileImageOutlined, LinkOutlined, CodeOutlined, CheckSquareOutlined, ClockCircleOutlined,
    HighlightOutlined, DownOutlined, ZoomOutOutlined, LineOutlined, UnorderedListOutlined, AimOutlined, FullscreenExitOutlined, SkinOutlined, SmileOutlined, QuestionCircleOutlined
} from '@ant-design/icons-vue'
import { ref } from 'vue'
const $props = defineProps({
    word: Object,
    wordContainer: Object
})
const { word, wordContainer } = $props

const [isFullScreen, fullScreen, exitFullScreen, toggleFullScreen, removeFullScreenListeners] = useFullScreen(wordContainer)
import { ChromePicker, TwitterPicker, SketchPicker } from 'vue-color'

import { WORD_FONT_SIZE_MAP, WORD_FONT_MAP } from '@/utils/enum'
import { ListStyle, ListType, RowFlex, ElementType, TitleLevel } from '@hufe921/canvas-editor'
import { reactive } from 'vue'

/**
 * 撤销
 */
const btnUndoWord = () => {
    word.command.executeUndo()
}

/**
 * 重做
 */
const btnRedoWord = () => {
    word.command.executeRedo()
}

/**
 * 清除格式
 */
const btnFormatWord = () => {
    word.command.executeFormat()
}

/**
 * 字体
 */
const currentFont = ref('Microsoft YaHei')
const btnFontWord = (font) => {
    currentFont.value = font
    word.command.executeFont(font)
}

/**
 * 字体大小
 */
const currentFontSize = ref(12)
const btnFontSizeWord = (fontSize) => {
    currentFontSize.value = fontSize
    word.command.executeSize(fontSize)
}

/**
 * 增大字号
 */
const btnSizeAddWord = () => {
    currentFontSize.value += 2
    const result = word.command.executeSizeAdd()
}

/**
 * 减小字号
 */
const btnSizeMinusWord = () => {
    if (currentFontSize.value <= 0) {
        return
    }
    currentFontSize.value -= 2
    word.command.executeSizeMinus()
}

/**
 * 加粗
 */
const btnBoldWord = () => {
    word.command.executeBold()
}

/**
 * 斜体
 */
const btnItalicWord = () => {
    word.command.executeItalic()
}

/**
 * 下划线
 */
const btnUnderlineWord = () => {
    word.command.executeUnderline()
}

/**
 * 删除线
 */
const btnStrikeoutWord = () => {
    word.command.executeStrikeout()
}

/**
 * 上标
 */
const btnSuperscriptWord = () => {
    word.command.executeSuperscript()
}

/**
 * 下标
 */
const btnSubscriptWord = () => {
    word.command.executeSubscript()
}

/**
 * 字体颜色
 */
const fontColor = ref('black')
watch(() => fontColor.value, (newValue) => {
    word.command.executeColor(newValue)
})

/**
 * 高亮
 */
const highlightColor = ref('yellow')
watch(() => highlightColor.value, (newValue) => {
    word.command.executeHighlight(newValue)
})

// const btnHighlightWord = () => {
//     word.command.executeHighlight('yellow')
// }

/**
 * 标题
 */
const btnTitleWord = (title) => {
    // TitleLevel.
    word.command.executeTitle(title)
    // word.command.executeTitle(TitleLevel.FIRST)
}

/**
 * 对齐
 */
const btnRowFlexWord = (direction) => {
    word.command.executeRowFlex(direction)
}

/**
 * 行间距
 */
const btnRowMarginWord = (margin) => {
    word.command.executeRowMargin(margin)
}

/**
 * 列表
 */
const btnInsertListWord = (listType, listStyle) => {
    word.command.executeList(listType, listStyle)
}

/**
 * 表格
 */
const tableRowNumber = ref(3)
const tableColNumber = ref(3)
const btnInsertTableWord = () => {
    word.command.executeInsertTable(tableRowNumber.value, tableColNumber.value)
}

/*
* 图片
*/
const btnInsertImageWord = () => {
    word.command.executeImage()
}

/**
 * 超链接
 */
const hyperlinkModal = ref(false)
const hyperlinkFormRef = ref()
const hyperlinkForm = reactive({
    text: '',
    url: '',
    urlPrefix: 'https://'
})
const btnHyperlinkWord = () => {
    hyperlinkModal.value = true
}
const onOkHyperlinkModal = () => {
    hyperlinkFormRef.value.validate().then(() => {
        word.command.executeHyperlink({
            type: ElementType.HYPERLINK,
            value: hyperlinkForm.text,
            url: hyperlinkForm.urlPrefix + hyperlinkForm.url,
            valueList: [
                {
                    // hyperlinkId: 'fff',
                    value: hyperlinkForm.text,
                    valueList: []
                }
            ]
        })

        hyperlinkModal.value = false
        hyperlinkForm.text = ''
        hyperlinkForm.url = ''
    })
}
const onCancelHyperlinkModal = () => {
    hyperlinkModal.value = false
}

/**
 * 分割线
 */
const btnSeparatorWord = () => {
    // instance.command.executeSeparator(dashArray: number[], option?: { lineWidth?: number; color?: string })
    word.command.executeSeparator()
}

/**
 * 水印
 */
const watermarkModal = ref(false)
const watermarkFormRef = ref()
const watermarkForm = reactive({
    content: '',
    color: 'red',
    size: 120,
    opacity: 0.3,
    font: 'Microsoft YaHei'
})
const btnInsertWatermarktWord = () => {
    watermarkModal.value = true
}
const onOkWatermarkModal = () => {
    watermarkFormRef.value.validate().then(() => {
        word.command.executeAddWatermark({
            data: watermarkForm.content,
            color: watermarkForm.color,
            opacity: watermarkForm.opacity,
            size: watermarkForm.size,
            font: watermarkForm.font
        })
        watermarkModal.value = false
    })
}
const onCancelWatermarkModal = () => {
    watermarkModal.value = false
}
// 删除水印
const btnDeleteWatermarktWord = () => {
    word.command.executeDeleteWatermark()
}

/**
 * 打印
 */
const btnPrintWord = () => {
    word.command.executePrint()
}
</script>

<style lang="css" scoped>
.word-operation-pane {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
}
</style>