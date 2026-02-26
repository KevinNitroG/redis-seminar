---@module 'lazy'
---@type LazySpec
return {
  {
    "kristijanhusak/vim-dadbod-ui",
    opts = function()
      vim.g.dbs = {
        {
          name = "redis",
          url = "redis:0",
        },
      }
    end,
    optional = true,
  },
}
