import sys

with open("portfolio.html", "r", encoding="utf-8") as f:
    html = f.read()

with open("new_content.html", "r", encoding="utf-8") as f:
    new_html = f.read()

start_str = '<div class="tab-content text-start" id="sae-v-pillsContent">'
start_idx = html.find(start_str)

if start_idx == -1:
    print("Could not find start_str")
    sys.exit(1)

# The end of the block in the original file is right before:
end_str = '                        </div>\n                    </div>\n                </div>\n\n            </div>'
end_idx = html.find(end_str, start_idx)

if end_idx == -1:
    print("Could not find end_str")
    sys.exit(1)

# Find the end of the `</div>` that closes `sae-v-pillsContent`. 
# Or we can just slice until end_str because end_str is exactly the line after the closing </div> of sae-v-pillsContent!
# Let's verify by checking what's before end_str in the original file:
# 802:
# 803:                             </div>
# 804:                         </div>

# The closing tag is `                            </div>\n`
closing_tag_idx = html.rfind('</div>', start_idx, end_idx)

# So the full replacement range is from start_idx to end_idx.
# Actually, since new_html contains the starting tag and the closing tag, we just replace `html[start_idx:closing_tag_idx + 6]`
# Let's do it safely:
new_portfolio = html[:start_idx] + new_html + "\n" + html[end_idx:]

with open("portfolio.html", "w", encoding="utf-8") as f:
    f.write(new_portfolio)

print("Replaced successfully!")
